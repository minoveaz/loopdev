export interface BotStateActions {
  onMarketExit?: () => Promise<void>;
  onSetToBE?: () => Promise<void>;
  onExecuteTP?: () => Promise<void>;
  onUpdateTrail?: (distance: number) => Promise<void>;
}
