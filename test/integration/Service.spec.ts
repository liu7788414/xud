import chai, { expect } from 'chai';
import Xud from '../../lib/Xud';
import chaiAsPromised from 'chai-as-promised';
import Service from '../../lib/service/Service';
import { NetworkClients } from '../../lib/types/enums';

chai.use(chaiAsPromised);

describe('API Service', () => {
  let xud: Xud;
  let service: Service;

  const placeOrderArgs = {
    orderId: '1',
    pairId: 'LTC/BTC',
    price: 100,
    quantity: 1,
  };

  before(async () => {
    const config = {
      logLevel: 'warn',
      p2p: {
        listen: false,
      },
      rpc: {
        disable: true,
      },
      lndbtc: {
        disable: true,
      },
      lndltc: {
        disable: true,
      },
      raiden: {
        disable: true,
      },
      db: {
        database: 'xud_test',
      },
    };

    xud = new Xud();
    await xud.start(config);
    service = xud.service;
  });

  it('should place an order', () => {
    expect(service.placeOrder(placeOrderArgs)).to.be.fulfilled;
  });

  it('should get orders', async () => {
    const args = {
      pairId: 'LTC/BTC',
      maxResults: 0,
    };
    const orders = service.getOrders(args);
    expect(orders.ownOrders.buyOrders).to.have.length(1);
    expect(orders.ownOrders.buyOrders[0].price).to.equal(placeOrderArgs.price);
    expect(orders.ownOrders.buyOrders[0].quantity).to.equal(placeOrderArgs.quantity);
    expect(orders.ownOrders.buyOrders[0].pairId).to.equal(placeOrderArgs.pairId);
  });

  it('should cancel an order', async () => {
    const args = {
      pairId: 'LTC/BTC',
      orderId: '1',
    };
    const cancelOrderPromise = service.cancelOrder(args);
    expect(cancelOrderPromise).to.be.fulfilled;
    const canceledOrder = await cancelOrderPromise;
    expect(canceledOrder.canceled).to.be.true;
  });

  it('should add two currencies', async () => {
    const addCurrencyPromises = [service.addCurrency({ currency: 'ABC', networkClient: NetworkClients.LND }),
      service.addCurrency({ currency: 'XYZ', networkClient: NetworkClients.LND })];
    await expect(Promise.all(addCurrencyPromises)).to.be.fulfilled;
  });

  it('should add a trading pair', async () => {
    const addPairPromise = service.addPair({
      baseCurrency: 'ABC',
      quoteCurrency: 'XYZ',
    });
    await expect(addPairPromise).to.be.fulfilled;
  });

  it('should fail adding a currency with a ticker that is not 3 characters long', async () => {
    const tooLongAddCurrencyPromise = service.addCurrency({ currency: 'GOOG', networkClient: NetworkClients.LND });
    await expect(tooLongAddCurrencyPromise).to.be.rejectedWith('currency must consist of exactly 3 upper case English letters');
  });

  it('should fail adding a currency with an invalid letter in its ticker', async () => {
    const invalidLetterAddCurrencyPromise = service.addCurrency({ currency: 'ÑEO', networkClient: NetworkClients.LND });
    await expect(invalidLetterAddCurrencyPromise).to.be.rejectedWith('currency must consist of exactly 3 upper case English letters');
  });

  it('should fail adding a currency with an invalid network client', async () => {
    const addCurrencyPromise = service.addCurrency({ currency: 'BTC', networkClient: -1 });
    await expect(addCurrencyPromise).to.be.rejectedWith('network client is not recognized');
  });

  it('should fail adding a currency that is already supported', async () => {
    const addCurrencyPromise = service.addCurrency({ currency: 'ABC', networkClient: NetworkClients.LND });
    await expect(addCurrencyPromise).to.be.rejectedWith('currency ABC is already supported');
  });

  it('should fail adding a pair that is already supported', async () => {
    const addPairPromise = service.addPair({
      baseCurrency: 'ABC',
      quoteCurrency: 'XYZ',
    });
    await expect(addPairPromise).to.be.rejectedWith('pair ABC/XYZ is already supported');
  });

  it('should fail adding a pair with a currency that is not supported', async () => {
    const addCurrencyPromise = service.addPair({ baseCurrency: 'XXX', quoteCurrency: 'ABC' });
    await expect(addCurrencyPromise).to.be.rejectedWith('currency XXX is not supported');
  });

  it('should fail removing a currency used in a supported trading pair', async () => {
    const removeCurrencyPromise = service.removeCurrency({ currency: 'ABC' });
    await expect(removeCurrencyPromise).to.be.rejectedWith('cannot be removed because it is used for');
  });

  it('should remove a trading pair', async () => {
    await expect(service.removePair({ pairId: 'ABC/XYZ' })).to.be.fulfilled;
  });

  it('should remove two currencies', async () => {
    const removeCurrencyPromises = [service.removeCurrency({ currency: 'ABC' }), service.removeCurrency({ currency: 'XYZ' })];
    await expect(Promise.all(removeCurrencyPromises)).to.be.fulfilled;
  });

  it('should shutdown', async () => {
    service.shutdown();
    const shutdownPromise = new Promise((resolve) => {
      xud.on('shutdown', () => resolve());
    });
    expect(shutdownPromise).to.be.fulfilled;
    await shutdownPromise;
  });
});
