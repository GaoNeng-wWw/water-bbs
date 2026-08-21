/* eslint-disable @typescript-eslint/no-unsafe-call */
import { TriggerDiscover } from '../trigger-discover.service';
import { TriggerEntity, TriggerId, TriggerKind } from '../trigger.entity';
import { TriggerFired, TriggerFiredId } from '../events';

describe(TriggerDiscover.name, () => {
  let service: TriggerDiscover;
  let em: { fork: ReturnType<typeof vi.fn> };
  let eventBus: {
    publish: ReturnType<typeof vi.fn>;
    subscribe: ReturnType<typeof vi.fn>;
  };
  let schedulerRegistry: {
    addCronJob: ReturnType<typeof vi.fn>;
    deleteCronJob: ReturnType<typeof vi.fn>;
  };
  let triggerMap: Map<TriggerId, boolean>;

  function createTrigger(
    overrides: Partial<TriggerEntity> = {},
  ): TriggerEntity {
    return {
      id: 'trigger-1' as unknown as TriggerId,
      name: 'test-trigger',
      workflowId: 'workflow-1' as any,
      kind: TriggerKind.Cron,
      cron: '* * * * *',
      ...overrides,
    } as TriggerEntity;
  }

  beforeEach(() => {
    em = {
      fork: vi.fn().mockReturnValue({
        findAll: vi.fn().mockResolvedValue([]),
      }),
    };
    eventBus = {
      publish: vi.fn(),
      subscribe: vi.fn(),
    };
    schedulerRegistry = {
      addCronJob: vi.fn(),
      deleteCronJob: vi.fn(),
    };
    triggerMap = new Map();

    service = new TriggerDiscover(
      em as any,
      eventBus as any,
      schedulerRegistry as any,
      triggerMap,
    );
  });

  describe('removeTrigger', () => {
    it('should delete cron job when trigger kind is Cron', () => {
      const trigger = createTrigger({
        kind: TriggerKind.Cron,
        name: 'my-cron',
      });

      service.removeTrigger(trigger);

      expect(schedulerRegistry.deleteCronJob).toHaveBeenCalledWith('my-cron');
    });

    it('should not delete cron job when trigger kind is not Cron', () => {
      const trigger = createTrigger({ kind: TriggerKind.Condition });

      service.removeTrigger(trigger);

      expect(schedulerRegistry.deleteCronJob).not.toHaveBeenCalled();
    });
  });

  describe('installTrigger', () => {
    it('should add cron job and set triggerMap when trigger kind is Cron', () => {
      const trigger = createTrigger({
        id: 't1' as unknown as TriggerId,
        kind: TriggerKind.Cron,
        name: 'cron-job',
        cron: '0 * * * *',
      });

      service.installTrigger(trigger);

      expect(schedulerRegistry.addCronJob).toHaveBeenCalledWith(
        'cron-job',
        expect.anything(),
      );
      expect(triggerMap.has('t1' as unknown as TriggerId)).toBe(true);
    });

    it('should set triggerMap when trigger kind is not Cron', () => {
      const trigger = createTrigger({
        id: 't2' as unknown as TriggerId,
        kind: TriggerKind.Condition,
      });

      service.installTrigger(trigger);

      expect(schedulerRegistry.addCronJob).not.toHaveBeenCalled();
      expect(triggerMap.has('t2' as unknown as TriggerId)).toBe(true);
    });
  });

  describe('uninstallTrigger', () => {
    it('should delete cron job when trigger kind is Cron', () => {
      const trigger = createTrigger({
        kind: TriggerKind.Cron,
        name: 'cron-job',
      });
      triggerMap.set(trigger.id, true);

      service.uninstallTrigger(trigger);

      expect(schedulerRegistry.deleteCronJob).toHaveBeenCalledWith('cron-job');
      expect(triggerMap.has(trigger.id)).toBe(true);
    });

    it('should delete from triggerMap when trigger kind is not Cron', () => {
      const trigger = createTrigger({ kind: TriggerKind.Condition });
      triggerMap.set(trigger.id, true);

      service.uninstallTrigger(trigger);

      expect(schedulerRegistry.deleteCronJob).not.toHaveBeenCalled();
      expect(triggerMap.has(trigger.id)).toBe(false);
    });
  });

  describe('onApplicationBootstrap', () => {
    it('should install cron jobs for Cron triggers', async () => {
      const trigger = createTrigger({
        kind: TriggerKind.Cron,
        name: 'bootstrap-cron',
        cron: '0 0 * * *',
      });
      em.fork.mockReturnValue({
        findAll: vi.fn().mockResolvedValue([trigger]),
      });

      await service.onApplicationBootstrap();

      expect(schedulerRegistry.addCronJob).toHaveBeenCalledWith(
        'bootstrap-cron',
        expect.anything(),
      );
      expect(eventBus.subscribe).not.toHaveBeenCalled();
    });

    it('should subscribe to eventBus for Condition triggers', async () => {
      const trigger = createTrigger({
        id: 'cond-1' as unknown as TriggerId,
        kind: TriggerKind.Condition,
      });
      em.fork.mockReturnValue({
        findAll: vi.fn().mockResolvedValue([trigger]),
      });

      await service.onApplicationBootstrap();

      expect(eventBus.subscribe).toHaveBeenCalledWith(expect.any(Function));
      expect(schedulerRegistry.addCronJob).not.toHaveBeenCalled();
    });

    it('should not publish TriggerFired when trigger is not in triggerMap', async () => {
      const trigger = createTrigger({
        id: 'cond-2' as unknown as TriggerId,
        kind: TriggerKind.Condition,
      });
      em.fork.mockReturnValue({
        findAll: vi.fn().mockResolvedValue([trigger]),
      });

      await service.onApplicationBootstrap();

      const subscriber = eventBus.subscribe.mock.calls[0][0];
      const event = { id: 'some-event' };
      subscriber(event);

      expect(eventBus.publish).not.toHaveBeenCalled();
    });

    it('should publish TriggerFired when trigger is in triggerMap and event is not TriggerFiredId', async () => {
      const trigger = createTrigger({
        id: 'cond-3' as unknown as TriggerId,
        kind: TriggerKind.Condition,
        workflowId: 'wf-1' as any,
      });
      em.fork.mockReturnValue({
        findAll: vi.fn().mockResolvedValue([trigger]),
      });
      triggerMap.set(trigger.id, true);

      await service.onApplicationBootstrap();

      const subscriber = eventBus.subscribe.mock.calls[0][0];
      const incomingEvent = { id: 'some.other.event' };
      subscriber(incomingEvent);

      expect(eventBus.publish).toHaveBeenCalledWith(
        new TriggerFired(trigger.id, trigger.workflowId, {}, [incomingEvent]),
      );
    });

    it('should not publish TriggerFired when event id is TriggerFiredId', async () => {
      const trigger = createTrigger({
        id: 'cond-4' as unknown as TriggerId,
        kind: TriggerKind.Condition,
      });
      em.fork.mockReturnValue({
        findAll: vi.fn().mockResolvedValue([trigger]),
      });
      triggerMap.set(trigger.id, true);

      await service.onApplicationBootstrap();

      const subscriber = eventBus.subscribe.mock.calls[0][0];
      subscriber({ id: TriggerFiredId });

      expect(eventBus.publish).not.toHaveBeenCalled();
    });

    it('should handle both Cron and Condition triggers', async () => {
      const cronTrigger = createTrigger({
        id: 'cron-1' as unknown as TriggerId,
        kind: TriggerKind.Cron,
        name: 'mixed-cron',
        cron: '* * * * *',
      });
      const condTrigger = createTrigger({
        id: 'cond-5' as unknown as TriggerId,
        kind: TriggerKind.Condition,
      });
      em.fork.mockReturnValue({
        findAll: vi.fn().mockResolvedValue([cronTrigger, condTrigger]),
      });

      await service.onApplicationBootstrap();

      expect(schedulerRegistry.addCronJob).toHaveBeenCalledWith(
        'mixed-cron',
        expect.anything(),
      );
      expect(eventBus.subscribe).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should do nothing when no triggers exist', async () => {
      em.fork.mockReturnValue({
        findAll: vi.fn().mockResolvedValue([]),
      });

      await service.onApplicationBootstrap();

      expect(schedulerRegistry.addCronJob).not.toHaveBeenCalled();
      expect(eventBus.subscribe).not.toHaveBeenCalled();
    });
  });
});
