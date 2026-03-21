"""
Example: Running a Backtest

This shows how to test a strategy before deploying it live.
"""

import asyncio
from datetime import datetime
from src.strategies.bitcoin.btc_trend_following import BTCTrendFollowing
from src.core.backtester import Backtester

async def backtest_btc_trend():
    """
    Example: Backtest BTC Trend Following strategy on 90 days of data
    """
    
    print("\n" + "="*70)
    print(" BACKTESTING BTC TREND FOLLOWING STRATEGY")
    print("="*70 + "\n")
    
    # Initialize strategy and backtester
    strategy = BTCTrendFollowing()
    backtester = Backtester(
        strategy=strategy,
        pair="BTC/USDT",
        timeframe="15m"
    )
    
    # Run backtest (90 days)
    try:
        results = await backtester.run(
            start_date="2025-12-01",
            end_date="2026-03-20",
            initial_capital=1000.0,  # $1000 starting capital
            fee_pct=0.075  # Binance 0.075% fee
        )
        
        # Print summary
        results.print_summary()
        
        # Save results
        await backtester.save_results(
            results,
            filepath="backtest_results/btc_trend_following_90days.json"
        )
        
        # Interpretation
        print("\n📋 INTERPRETATION:\n")
        if results.total_trades == 0:
            print("❌ CRITICAL: No trades generated!")
            print("   This means the strategy NEVER found entry conditions.")
            print("   Possible causes:")
            print("   1. Price NEVER > SMA20 > SMA50 in this period")
            print("   2. SMA calculation is wrong (NaN values)")
            print("   3. Market data is missing or incorrect")
            print("\n   ACTION: Review strategy logic and debug SMA values\n")
        
        elif results.win_rate_pct < 50:
            print(f"❌ Win rate {results.win_rate_pct:.1f}% is too low")
            print("   Strategy is losing money on average.")
            print("   NOT READY for live trading\n")
        
        elif results.profit_factor < 1.5:
            print(f"⚠️  Profit factor {results.profit_factor:.2f} is marginal")
            print("   Gross wins don't sufficiently offset losses.")
            print("   Consider improving entry/exit logic\n")
        
        elif results.max_drawdown_pct > 25:
            print(f"⚠️  Max drawdown {results.max_drawdown_pct:.1f}% is high")
            print("   Account can drop >25% in worst case.")
            print("   Risk management may be needed\n")
        
        else:
            print("✅ BACKTEST PASSED - Ready for next stage")
            print("   Next: Paper trading for 7 days in real-time")
            print("   Then: Live trading with small position size\n")
        
    except Exception as e:
        print(f"❌ Backtest failed: {e}")
        import traceback
        traceback.print_exc()


async def backtest_multiple_strategies():
    """
    Example: Compare multiple strategies
    """
    
    from src.strategies.baseline.rsi_mean_reversion import RSIMeanReversionStrategy
    from src.strategies.baseline.intraday_atr import IntradayATRStrategy
    
    strategies_to_test = [
        ("BTC Trend Following", BTCTrendFollowing()),
        ("RSI Mean Reversion", RSIMeanReversionStrategy()),
        ("ATR Breakout", IntradayATRStrategy()),
    ]
    
    print("\n" + "="*70)
    print(" COMPARING MULTIPLE STRATEGIES")
    print("="*70 + "\n")
    
    results_list = []
    
    for name, strategy in strategies_to_test:
        print(f"\n🔄 Testing {name}...")
        
        backtester = Backtester(strategy, pair="BTC/USDT")
        
        try:
            results = await backtester.run(
                start_date="2025-12-01",
                end_date="2026-03-20"
            )
            results_list.append(results)
            
            print(f"   ✅ {results.total_trades} trades | "
                  f"Win rate: {results.win_rate_pct:.1f}% | "
                  f"Profit factor: {results.profit_factor:.2f}")
            
        except Exception as e:
            print(f"   ❌ Failed: {e}")
    
    # Summary table
    print("\n" + "="*70)
    print(" COMPARISON TABLE")
    print("="*70)
    print(f"{'Strategy':<25} {'Trades':<10} {'Win %':<10} {'Profit %':<12} {'Sharpe':<8}")
    print("-"*70)
    
    for r in results_list:
        print(f"{r.strategy_name:<25} {r.total_trades:<10} "
              f"{r.win_rate_pct:<10.1f} {r.total_profit_pct:<12.2f} "
              f"{r.sharpe_ratio:<8.2f}")
    
    # Find best
    if results_list:
        best = max(results_list, key=lambda x: x.sharpe_ratio)
        print("\n" + "="*70)
        print(f"🏆 BEST STRATEGY (by Sharpe ratio): {best.strategy_name}")
        print("="*70 + "\n")


if __name__ == "__main__":
    # Run backtest
    asyncio.run(backtest_btc_trend())
    
    # Compare strategies (optional)
    # asyncio.run(backtest_multiple_strategies())
