"""
Trade History API Routes
Endpoints para acceder al histórico de órdenes virtuales (paper trading)
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from loguru import logger

router = APIRouter(prefix="/api/orders", tags=["trade-history"])

# Global strategy manager (injected at startup)
_strategy_manager = None

def set_strategy_manager(manager):
    """Inyectar StrategyManager global"""
    global _strategy_manager
    _strategy_manager = manager
    logger.info("StrategyManager instance injected into orders_routes")


# ============================================================================
# ENDPOINT 1: GET /api/orders - Listar órdenes con filtros y paginación
# ============================================================================

@router.get("", response_model=Dict[str, Any], tags=["orders"])
def get_orders(
    bot_id: Optional[str] = Query(None, description="Filtrar por bot_id"),
    side: Optional[str] = Query(None, description="Filtrar por side (buy/sell)"),
    status: Optional[str] = Query(None, description="Filtrar por status"),
    limit: int = Query(50, ge=1, le=100, description="Límite de resultados"),
    offset: int = Query(0, ge=0, description="Offset para paginación")
):
    """
    Obtener listado de órdenes virtuales con filtros.
    
    Query params:
    - bot_id: UUID del bot (opcional)
    - side: 'buy' o 'sell' (opcional)
    - status: 'filled', 'cancelled', etc (opcional)
    - limit: 1-100 (default 50)
    - offset: para paginación (default 0)
    
    Returns:
    {
        "data": [
            {
                "id": "uuid",
                "bot_id": "uuid",
                "bot_name": "Bot Name",
                "side": "buy|sell",
                "price": 74192.60,
                "quantity": 0.013478,
                "status": "filled",
                "signal_source": "SMA20_CROSS_UP|STOP_LOSS|TAKE_PROFIT",
                "created_at": "2026-03-18T10:01:24Z",
                "exchange_order_id": "VIRTUAL_5d9fcc41"
            }
        ],
        "total": 42,
        "limit": 50,
        "offset": 0,
        "pages": 1
    }
    """
    try:
        if _strategy_manager is None:
            raise HTTPException(status_code=503, detail="StrategyManager not initialized")
        
        # Obtener todas las órdenes con filtros (primero sin paginación para contar total)
        query = _strategy_manager.supabase.table("quant_orders").select("*")
        
        # Aplicar filtros
        if bot_id:
            query = query.eq("bot_id", bot_id)
        if side:
            query = query.eq("side", side.lower())
        if status:
            query = query.eq("status", status)
        
        # Ejecutar query con paginación
        response = (
            query
            .order("created_at", desc=True)
            .range(offset, offset + limit - 1)
            .execute()
        )
        
        # Obtener total count (Supabase devuelve el count en los headers)
        total_query = _strategy_manager.supabase.table("quant_orders").select("id", count="exact")
        if bot_id:
            total_query = total_query.eq("bot_id", bot_id)
        if side:
            total_query = total_query.eq("side", side.lower())
        if status:
            total_query = total_query.eq("status", status)
        total_response = total_query.execute()
        total = total_response.count if hasattr(total_response, 'count') and total_response.count is not None else len(response.data or [])
        
        if not response.data:
            logger.debug(f"No orders found with filters: bot_id={bot_id}, side={side}, status={status}")
            return {
                "data": [],
                "total": 0,
                "limit": limit,
                "offset": offset,
                "pages": 0
            }
        
        # Enriquecer órdenes con nombre del bot
        orders_enriched = []
        for order in response.data:
            # Buscar nombre del bot en caché o en DB
            bot_name = order.get("bot_name", "Unknown")
            if not bot_name or bot_name == "Unknown":
                try:
                    bot_response = _strategy_manager.supabase.table("quant_bots").select("name").eq("id", order["bot_id"]).execute()
                    if bot_response.data:
                        bot_name = bot_response.data[0]["name"]
                except:
                    bot_name = "Unknown"
            
            orders_enriched.append({
                "id": order["id"],
                "bot_id": order["bot_id"],
                "bot_name": bot_name,
                "side": order["side"],
                "price": float(order["price"]),
                "quantity": float(order["quantity"]),
                "status": order["status"],
                "signal_source": order.get("signal_source", "N/A"),
                "created_at": order["created_at"],
                "exchange_order_id": order.get("exchange_order_id", "N/A")
            })
        
        pages = (total + limit - 1) // limit if total > 0 else 0
        
        logger.debug(f"Retrieved {len(orders_enriched)} orders (total: {total}, page: {offset // limit + 1}/{pages})")
        
        return {
            "data": orders_enriched,
            "total": total,
            "limit": limit,
            "offset": offset,
            "pages": pages
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching orders: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching orders: {str(e)}")


# ============================================================================
# ENDPOINT 2: GET /api/orders/stats - Estadísticas agregadas
# ============================================================================

@router.get("/stats", response_model=Dict[str, Any], tags=["orders"])
def get_order_stats(
    bot_id: Optional[str] = Query(None, description="Filtrar por bot_id"),
    from_date: Optional[str] = Query(None, description="Fecha inicio (ISO 8601)"),
    to_date: Optional[str] = Query(None, description="Fecha fin (ISO 8601)")
):
    """
    Obtener estadísticas agregadas de órdenes.
    
    Query params:
    - bot_id: UUID del bot (opcional)
    - from_date: ISO 8601 format (opcional)
    - to_date: ISO 8601 format (opcional)
    
    Returns:
    {
        "total_orders": 42,
        "buy_orders": 21,
        "sell_orders": 21,
        "total_pnl_usdt": 156.45,
        "total_pnl_pct": 4.2,
        "win_rate": 57.1,
        "avg_pnl_usdt": 7.45,
        "avg_pnl_pct": 0.35,
        "top_exit_reason": "TAKE_PROFIT",
        "best_trade": {
            "pnl": 245.60,
            "pnl_pct": 8.5,
            "entry_price": 71000.0,
            "exit_price": 71500.0
        },
        "worst_trade": {
            "pnl": -89.23,
            "pnl_pct": -3.1,
            "entry_price": 72000.0,
            "exit_price": 69800.0
        }
    }
    """
    try:
        if _strategy_manager is None:
            raise HTTPException(status_code=503, detail="StrategyManager not initialized")
        
        # Construir query
        query = _strategy_manager.supabase.table("quant_orders").select("*")
        
        if bot_id:
            query = query.eq("bot_id", bot_id)
        
        if from_date:
            query = query.gte("created_at", from_date)
        
        if to_date:
            query = query.lte("created_at", to_date)
        
        response = query.execute()
        
        if not response.data:
            logger.debug("No orders found for stats calculation")
            return {
                "total_orders": 0,
                "buy_orders": 0,
                "sell_orders": 0,
                "total_pnl_usdt": 0.0,
                "total_pnl_pct": 0.0,
                "win_rate": 0.0,
                "avg_pnl_usdt": 0.0,
                "avg_pnl_pct": 0.0,
                "top_exit_reason": "N/A",
                "best_trade": None,
                "worst_trade": None
            }
        
        orders = response.data
        
        # Cálculos básicos
        total_orders = len(orders)
        buy_orders = len([o for o in orders if o["side"] == "buy"])
        sell_orders = len([o for o in orders if o["side"] == "sell"])
        
        # Calcular PnL por cada trade completado (BUY + SELL)
        pnl_values = []
        exit_reasons = []
        
        i = 0
        while i < len(orders):
            order = orders[i]
            
            # Si es una orden de compra, buscar su correspondiente venta
            if order["side"] == "buy":
                # Buscar la siguiente orden de venta del mismo bot
                for j in range(i + 1, len(orders)):
                    if orders[j]["bot_id"] == order["bot_id"] and orders[j]["side"] == "sell":
                        entry_price = float(order["price"])
                        exit_price = float(orders[j]["price"])
                        quantity = float(order["quantity"])
                        
                        pnl_usdt = (exit_price - entry_price) * quantity
                        pnl_pct = ((exit_price - entry_price) / entry_price) * 100 if entry_price > 0 else 0
                        
                        pnl_values.append({
                            "pnl_usdt": pnl_usdt,
                            "pnl_pct": pnl_pct,
                            "entry_price": entry_price,
                            "exit_price": exit_price,
                            "exit_reason": orders[j].get("signal_source", "N/A")
                        })
                        
                        exit_reasons.append(orders[j].get("signal_source", "N/A"))
                        break
            
            i += 1
        
        # Estadísticas de PnL
        total_pnl_usdt = sum(pnl["pnl_usdt"] for pnl in pnl_values)
        
        # Win rate: trades con PnL positivo / total trades
        winning_trades = len([p for p in pnl_values if p["pnl_usdt"] > 0])
        win_rate = (winning_trades / len(pnl_values) * 100) if pnl_values else 0.0
        
        # Promedio PnL
        avg_pnl_usdt = (total_pnl_usdt / len(pnl_values)) if pnl_values else 0.0
        avg_pnl_pct = sum(p["pnl_pct"] for p in pnl_values) / len(pnl_values) if pnl_values else 0.0
        
        # PnL total en porcentaje (base 1000 USDT)
        total_pnl_pct = (total_pnl_usdt / 1000 * 100) if pnl_values else 0.0
        
        # Mejor y peor trade
        best_trade = max(pnl_values, key=lambda x: x["pnl_usdt"]) if pnl_values else None
        worst_trade = min(pnl_values, key=lambda x: x["pnl_usdt"]) if pnl_values else None
        
        # Razón de salida más común
        from collections import Counter
        top_exit_reason = Counter(exit_reasons).most_common(1)[0][0] if exit_reasons else "N/A"
        
        logger.info(f"Stats calculated: {total_orders} orders, Win rate: {win_rate:.1f}%, Total PnL: ${total_pnl_usdt:.2f}")
        
        return {
            "total_orders": total_orders,
            "buy_orders": buy_orders,
            "sell_orders": sell_orders,
            "total_pnl_usdt": round(total_pnl_usdt, 2),
            "total_pnl_pct": round(total_pnl_pct, 2),
            "win_rate": round(win_rate, 1),
            "avg_pnl_usdt": round(avg_pnl_usdt, 2),
            "avg_pnl_pct": round(avg_pnl_pct, 2),
            "top_exit_reason": top_exit_reason,
            "best_trade": {
                "pnl": round(best_trade["pnl_usdt"], 2),
                "pnl_pct": round(best_trade["pnl_pct"], 2),
                "entry_price": round(best_trade["entry_price"], 2),
                "exit_price": round(best_trade["exit_price"], 2)
            } if best_trade else None,
            "worst_trade": {
                "pnl": round(worst_trade["pnl_usdt"], 2),
                "pnl_pct": round(worst_trade["pnl_pct"], 2),
                "entry_price": round(worst_trade["entry_price"], 2),
                "exit_price": round(worst_trade["exit_price"], 2)
            } if worst_trade else None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error calculating order stats: {e}")
        raise HTTPException(status_code=500, detail=f"Error calculating stats: {str(e)}")


# ============================================================================
# ENDPOINT 3: GET /api/orders/closed-trades - Trades completados (BUY+SELL)
# ============================================================================

@router.get("/closed-trades", response_model=Dict[str, Any], tags=["orders"])
def get_closed_trades(
    bot_id: Optional[str] = Query(None, description="Filtrar por bot_id"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """
    Obtener trades completados (pares BUY+SELL) con análisis de PnL.
    
    Query params:
    - bot_id: UUID del bot (opcional)
    - limit: 1-100 (default 50)
    - offset: para paginación (default 0)
    
    Returns:
    {
        "data": [
            {
                "entry_order": { /* order object */ },
                "exit_order": { /* order object */ },
                "entry_price": 74192.60,
                "exit_price": 69225.01,
                "quantity": 0.013478,
                "duration_minutes": 1425,
                "pnl_usdt": -66.65,
                "pnl_pct": -6.65,
                "exit_reason": "STOP_LOSS"
            }
        ],
        "total": 21,
        "limit": 50,
        "offset": 0,
        "pages": 1
    }
    """
    try:
        if _strategy_manager is None:
            raise HTTPException(status_code=503, detail="StrategyManager not initialized")
        
        logger.debug("Fetching all orders for closed trades pairing...")
        # Obtener todas las órdenes ordenadas
        query = _strategy_manager.supabase.table("quant_orders").select("*").order("created_at", desc=False)
        
        if bot_id:
            query = query.eq("bot_id", bot_id)
        
        logger.debug("Executing Supabase query...")
        response = query.execute()
        logger.debug(f"Query returned {len(response.data) if response.data else 0} orders")
        
        if not response.data:
            logger.debug("No orders found for closed trades")
            return {
                "data": [],
                "total": 0,
                "limit": limit,
                "offset": offset,
                "pages": 0
            }
        
        orders = response.data
        logger.debug(f"Starting to pair {len(orders)} orders...")
        
        # Emparejar BUY + SELL orders
        closed_trades = []
        used_indices = set()
        
        for i, buy_order in enumerate(orders):
            if i in used_indices or buy_order["side"] != "buy":
                continue
            
            # Buscar la próxima orden SELL del mismo bot
            for j in range(i + 1, len(orders)):
                if j in used_indices:
                    continue
                
                sell_order = orders[j]
                
                if sell_order["bot_id"] == buy_order["bot_id"] and sell_order["side"] == "sell":
                    # Encontramos el pair
                    entry_price = float(buy_order["price"])
                    exit_price = float(sell_order["price"])
                    quantity = float(buy_order["quantity"])
                    
                    pnl_usdt = (exit_price - entry_price) * quantity
                    pnl_pct = ((exit_price - entry_price) / entry_price) * 100
                    
                    # Calcular duración
                    entry_time = datetime.fromisoformat(buy_order["created_at"].replace("Z", "+00:00"))
                    exit_time = datetime.fromisoformat(sell_order["created_at"].replace("Z", "+00:00"))
                    duration_minutes = int((exit_time - entry_time).total_seconds() / 60)
                    
                    closed_trades.append({
                        "entry_order": {
                            "id": buy_order["id"],
                            "side": buy_order["side"],
                            "price": entry_price,
                            "quantity": quantity,
                            "created_at": buy_order["created_at"],
                            "signal_source": buy_order.get("signal_source", "N/A")
                        },
                        "exit_order": {
                            "id": sell_order["id"],
                            "side": sell_order["side"],
                            "price": exit_price,
                            "quantity": quantity,
                            "created_at": sell_order["created_at"],
                            "signal_source": sell_order.get("signal_source", "N/A")
                        },
                        "entry_price": round(entry_price, 2),
                        "exit_price": round(exit_price, 2),
                        "quantity": round(quantity, 6),
                        "duration_minutes": duration_minutes,
                        "pnl_usdt": round(pnl_usdt, 2),
                        "pnl_pct": round(pnl_pct, 2),
                        "exit_reason": sell_order.get("signal_source", "N/A")
                    })
                    
                    used_indices.add(i)
                    used_indices.add(j)
                    break
        
        # Ordenar por fecha de salida (más reciente primero)
        closed_trades.sort(key=lambda x: x["exit_order"]["created_at"], reverse=True)
        
        # Paginar
        total = len(closed_trades)
        paginated_trades = closed_trades[offset:offset + limit]
        pages = (total + limit - 1) // limit if total > 0 else 0
        
        logger.debug(f"Retrieved {len(paginated_trades)} closed trades (total: {total})")
        
        return {
            "data": paginated_trades,
            "total": total,
            "limit": limit,
            "offset": offset,
            "pages": pages
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching closed trades: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching trades: {str(e)}")
