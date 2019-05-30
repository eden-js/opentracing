
// Require dependencies
const config      = require('config');
const Daemon      = require('controller');
const middleware  = require('express-opentracing').default;
const opentracing = require('opentracing');

/**
 * Build notification controller
 */
class PrometheusDaemon extends Daemon {
  /**
   * Construct notification controller
   */
  constructor() {
    // Run super
    super();
    
  }


  // ////////////////////////////////////////////////////////////////////////////
  //
  // INITIALIZE METHODS
  //
  // ////////////////////////////////////////////////////////////////////////////

  /**
   * builds notification controller
   */
  static async initialize(eden) {
    // create tracer
    const data = {
      tracer : new opentracing.Tracer(),
    };

    // hook tracer
    await eden.hook('opentracing.tracer', data);

    // set tracer to eden
    eden.tracer = data.tracer;

    // on render
    eden.pre('eden.router.create', (app) => {
      // use metrics
      app.use(middleware({
        tracer : eden.tracer,
      }));
    });
  }
}

/**
 * Export prometheus daemon
 *
 * @type {PrometheusDaemon}
 */
module.exports = PrometheusDaemon;
