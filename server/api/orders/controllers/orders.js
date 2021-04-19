'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

 const stripe = require('stripe')('secret_key_goes_here');

    module.exports = {
        /**
         * Create a record.
         *
         * @return {Object}
         */

     create: async (ctx) => {
            const {
                address,
                amount,
                foods,
                postalCode,
                token,
                city
            } = ctx.request.body;
            
            // Send charge to Stripe
            const charge = await stripe.charges.create({
                amount: amount * 100,
                currency: "usd",
                description: `Order ${new Date(Date.now())} - User ${ctx.state.user._id}`,
                source: token
            });
            
            // Create order in database
            const order = await strapi.api.orders.services.orders.create({
                user: ctx.state.user._id,
                address,
                amount,
                foods,
                postalCode,
                city
              });
            
            return order;
        }
    }