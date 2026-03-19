"""
REST API Routes for Strategy Metrics

Endpoints:
- GET /strategies/{bot_id}/metrics - Fetch current metrics snapshot
- GET /strategies/registry - Already exists in main.py
"""

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from loguru import logger
from typing import Optional, Dict, Any
import asyncio
import json

from ..core.metrics_calculator import StrategyMetricsCalculator
from ..core.strategy_manager import StrategyManager
from ..core.strategy_registry import STRATEGY_REGISTRY

router = APIRouter(prefix="/strategies", tags=["metrics"])

# Global strategy manager instance (injected from main.py)
_strategy_manager: Optional[StrategyManager] = None

def set_strategy_manager(sm: StrategyManager):
    """Inject the global strategy manager instance."""
    global _strategy_manager
    _strategy_manager = sm
    logger.info("StrategyManager instance injected into metrics_routes")


class MetricsWebSocketManager:
    """Manages WebSocket connections for real-time metrics streaming."""
    
    def __init__(self):
        self.active_connections: Dict[str, list] = {}  # bot_id -> [websockets]
    
    async def connect(self, bot_id: str, websocket: WebSocket):
        await websocket.accept()
        if bot_id not in self.active_connections:
            self.active_connections[bot_id] = []
        self.active_connections[bot_id].append(websocket)
        logger.success(f"WebSocket connected for bot {bot_id}")
    
    def disconnect(self, bot_id: str, websocket: WebSocket):
        if bot_id in self.active_connections:
            self.active_connections[bot_id].remove(websocket)
            if not self.active_connections[bot_id]:
                del self.active_connections[bot_id]
            logger.info(f"WebSocket disconnected for bot {bot_id}")
    
    async def broadcast(self, bot_id: str, data: Dict[str, Any]):
        """Send metrics to all connected clients for this bot."""
        if bot_id not in self.active_connections:
            return
        
        message = {
            "event": "metrics_update",
            "timestamp": data.get("last_updated"),
            "data": data
        }
        
        dead_connections = []
        for websocket in self.active_connections[bot_id]:
            try:
                await websocket.send_json(message)
            except Exception as e:
                logger.error(f"Error sending metrics to client: {e}")
                dead_connections.append(websocket)
        
        # Clean up dead connections
        for ws in dead_connections:
            self.disconnect(bot_id, ws)


# Global WebSocket manager
ws_manager = MetricsWebSocketManager()


@router.get("/{bot_id}/metrics")
async def get_bot_metrics(bot_id: str) -> Dict[str, Any]:
    """
    Fetch current metrics snapshot for a bot.
    
    Returns metrics like RSI, SMA50, signals, position preview, volatility.
    
    Response:
        {
            "success": true,
            "data": {
                "current_price": 71073.74,
                "rsi": {...},
                "sma50": {...},
                "signals": {...},
                "preview": {...},
                "volatility": {...},
                "last_updated": "2026-03-18T22:30:00Z",
                "update_frequency_ms": 1000
            }
        }
    """
    try:
        # Use injected global strategy manager
        if _strategy_manager is None:
            raise HTTPException(status_code=503, detail="StrategyManager not initialized")
        
        # Get bot data from active bots
        if bot_id not in _strategy_manager.active_bot_data:
            raise HTTPException(status_code=404, detail=f"Bot {bot_id} not found or inactive")
        
        bot_data = _strategy_manager.active_bot_data[bot_id]
        strategy_id = bot_data.get("core_id")
        
        if not strategy_id or strategy_id not in STRATEGY_REGISTRY:
            raise HTTPException(status_code=400, detail=f"Strategy {strategy_id} not found")
        
        # Get strategy parameters from registry (ZERO HARDCODING)
        strategy_def = STRATEGY_REGISTRY[strategy_id]
        
        # Build params dict from registry (keys match strategy_params keys expected by build_metrics_snapshot)
        params = {}
        for p in strategy_def.parameters:
            params[p.id] = p.default
        
        # Add sensible defaults for metrics calculation if missing
        # These are for RSI/SMA metrics display, not strategy logic
        if "rsi_period" not in params:
            params["rsi_period"] = 14
        if "oversold_level" not in params:
            params["oversold_level"] = 30
        if "overbought_level" not in params:
            params["overbought_level"] = 70
        if "sma_period" not in params:
            params["sma_period"] = 20
        if "atr_tp_multiplier" not in params:
            params["atr_tp_multiplier"] = 1.5
        if "atr_sl_multiplier" not in params:
            params["atr_sl_multiplier"] = 1.5
        
        # Get current market data
        # In production, this would come from the live data feed in strategy_manager
        current_snapshot = bot_data.get("_metrics_snapshot", {})
        
        if not current_snapshot:
            # Build from strategy state if available
            current_snapshot = {
                "current_price": bot_data.get("current_price", 0),
                "rsi_value": bot_data.get("_current_rsi", 0),
                "sma_value": bot_data.get("_current_sma", 0),
                "atr": bot_data.get("_current_atr", 0),
                "atr_history": bot_data.get("_atr_history", [])
            }
        
        # Calculate metrics
        metrics = StrategyMetricsCalculator.build_metrics_snapshot(
            current_price=current_snapshot.get("current_price", 0),
            rsi_value=current_snapshot.get("rsi_value", 0),
            sma_value=current_snapshot.get("sma_value", 0),
            atr=current_snapshot.get("atr", 0),
            strategy_params=params,
            atr_history=current_snapshot.get("atr_history")
        )
        
        metrics_dict = StrategyMetricsCalculator.metrics_to_dict(metrics)
        
        return {
            "success": True,
            "data": metrics_dict
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching metrics for bot {bot_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.websocket("/ws/{bot_id}/metrics")
async def websocket_bot_metrics(websocket: WebSocket, bot_id: str):
    """
    WebSocket endpoint for real-time metrics streaming.
    
    Updates sent every 1-2 seconds with current RSI, SMA50, signals, etc.
    
    Message format:
        {
            "event": "metrics_update",
            "timestamp": "2026-03-18T22:30:01Z",
            "data": {...metrics snapshot...}
        }
    """
    await ws_manager.connect(bot_id, websocket)
    
    try:
        # Send initial metrics
        try:
            initial_response = await get_bot_metrics(bot_id)
            if initial_response.get("success"):
                await websocket.send_json({
                    "event": "metrics_update",
                    "timestamp": initial_response["data"].get("last_updated"),
                    "data": initial_response["data"]
                })
        except Exception as e:
            await websocket.send_json({
                "event": "error",
                "message": f"Failed to fetch initial metrics: {str(e)}"
            })
        
        # Keep connection alive and handle incoming messages
        while True:
            try:
                # Wait for client message (ping/request for fresh data)
                message = await asyncio.wait_for(websocket.receive_text(), timeout=30.0)
                
                # If client sends anything, respond with fresh metrics
                if message:
                    try:
                        response = await get_bot_metrics(bot_id)
                        if response.get("success"):
                            await websocket.send_json({
                                "event": "metrics_update",
                                "timestamp": response["data"].get("last_updated"),
                                "data": response["data"]
                            })
                    except HTTPException as e:
                        await websocket.send_json({
                            "event": "error",
                            "message": e.detail
                        })
            
            except asyncio.TimeoutError:
                # Send periodic ping/keep-alive
                try:
                    response = await get_bot_metrics(bot_id)
                    if response.get("success"):
                        await websocket.send_json({
                            "event": "metrics_update",
                            "timestamp": response["data"].get("last_updated"),
                            "data": response["data"]
                        })
                except Exception as e:
                    logger.debug(f"Error in WebSocket metrics loop: {e}")
            
            except WebSocketDisconnect:
                ws_manager.disconnect(bot_id, websocket)
                logger.info(f"WebSocket disconnected for bot {bot_id}")
                break
            except Exception as e:
                logger.error(f"WebSocket error for bot {bot_id}: {e}")
                ws_manager.disconnect(bot_id, websocket)
                break
    
    except Exception as e:
        logger.error(f"Error in WebSocket handler: {e}")
        ws_manager.disconnect(bot_id, websocket)
