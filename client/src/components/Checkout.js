import React from "react";
import { Container, Box, Button, Heading, Text, TextField, Modal, Spinner } from "gestalt";
import { Elements, StripeProvider, CardElement, injectStripe } from 'react-stripe-elements';
import ToastMessage from "./ToastMessage";
import { getCart, calculatePrice, clearCart, calculateAmount } from "../utils";
import { withRouter } from "react-router-dom";
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class _CheckoutForm extends React.Component {
  state = {
    cartItems: [],
    address: "",
    postalCode: "",
    city: "",
    confirmationEmailAddress: "",
    toast: false,
    toastMessage: "",
    orderProcessing: false,
    modal: false
  };

  componentDidMount() {
    this.setState({ cartItems: getCart() });
  }

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  handleConfirmOrder = async event => {
    event.preventDefault();

    if (this.isFormEmpty(this.state)) {
      this.showToast("Fill in all fields");
      return;
    }

    this.setState({ modal: true });
  };

  // Send order to stripe
  handleSubmitOrder = async () => {
    const { cartItems, city, address, postalCode } = this.state;

    const amount = calculateAmount(cartItems);
    // Process order
    this.setState({ orderProcessing: true });
    let token;
    try {
      const response = await this.props.stripe.createToken();
      token = response.token.id;
      await strapi.createEntry("orders", {
        amount,
        foods: cartItems,
        city,
        postalCode,
        address,
        token
      });
      this.setState({ orderProcessing: false, modal: false });
      clearCart();
      this.showToast("Your order has been successfully submitted!", true);
    } catch (err) {
      this.setState({ orderProcessing: false, modal: false });
      this.showToast(err.message);
    }
  };

  isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) => {
    return !address || !postalCode || !city || !confirmationEmailAddress;
  };

  showToast = (toastMessage, redirect = false) => {
    this.setState({ toast: true, toastMessage });
    setTimeout(
      () =>
        this.setState(
          { toast: false, toastMessage: "" },
          // if true passed to 'redirect' argument, redirect home
          () => redirect && this.props.history.push("/")
        ),
      5000
    );
  };

  closeModal = () => this.setState({ modal: false });

  render() {
    const { toast, toastMessage, cartItems, modal, orderProcessing } = this.state;

    return (
      <Container>
        <Box
          color="darkWash"
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          {/* Checkout Form Heading */}
          <Heading color="midnight">Checkout</Heading>
          {cartItems.length > 0 ? (
            <React.Fragment>
              {/* User Cart */}
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                direction="column"
                marginTop={2}
                marginBottom={6}
              >
                <Text color="darkGray" italic>
                  {cartItems.length} Items for Checkout
                </Text>
                <Box padding={2}>
                  {cartItems.map(item => (
                    <Box key={item._id} padding={1}>
                      <Text color="midnight">
                        {item.name} x {item.quantity} - $
                        {item.quantity * item.price}
                      </Text>
                    </Box>
                  ))}
                </Box>
                <Text bold>Total Amount: {calculatePrice(cartItems)}</Text>
              </Box>
              {/* Checkout Form */}
              <form
                style={{
                  display: "inlineBlock",
                  textAlign: "center",
                  maxWidth: 450
                }}
                onSubmit={this.handleConfirmOrder}
              >
             
                {/* Delivery Address Input */}
                <TextField
                  id="address"
                  type="text"
                  name="address"
                  placeholder="Delivery Address"
                  onChange={this.handleChange}
                />
              
                {/* Postal Code Input */}
                <TextField
                  id="postalCode"
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  onChange={this.handleChange}
                />
              
                {/* City Input */}
                <TextField
                  id="city"
                  type="text"
                  name="city"
                  placeholder="City of Residence"
                  onChange={this.handleChange}
                />
              
                {/* Confirmation Email Address Input */}
                <TextField
                  id="confirmationEmailAddress"
                  type="email"
                  name="confirmationEmailAddress"
                  placeholder="Confirmation Email Address"
                  onChange={this.handleChange}
                />
              
                {/* Credit Card Element */}
                <CardElement
                  id="stripe__input"
                  onReady={input => input.focus()}
                />

              <button id="stripe__button" type="submit">
                Submit
              </button>

              </form>
            </React.Fragment>
          ) : (
            // Default Text if No Items in Cart
            <Box color="darkWash" shape="rounded" padding={4}>
              <Heading align="center" color="watermelon" size="xs">
                Your Cart is Empty
              </Heading>
              <Text align="center" italic color="green">
                Add some food!
              </Text>
            </Box>
          )}
        </Box>
        {/* Confirmation Modal */}
        {modal && (
          <ConfirmationModal
            orderProcessing={orderProcessing}
            cartItems={cartItems}
            closeModal={this.closeModal}
            handleSubmitOrder={this.handleSubmitOrder}
          />
        )}
        <ToastMessage show={toast} message={toastMessage} />
      </Container>
    );
  }
}

const ConfirmationModal = ({
  orderProcessing,
  cartItems,
  closeModal,
  handleSubmitOrder
}) => (
  <Modal
    accessibilityCloseLabel="close"
    accessibilityModalLabel="Confirm Your Order"
    heading="Confirm Your Order"
    onDismiss={closeModal}
    footer={
      <Box
        display="flex"
        marginRight={-1}
        marginLeft={-1}
        justifyContent="center"
      >
        <Box padding={1}>
          <Button
            size="lg"
            color="red"
            text="Submit"
            disabled={orderProcessing}
            onClick={handleSubmitOrder}
          />
        </Box>
        <Box padding={1}>
          <Button
            size="lg"
            text="Cancel"
            disabled={orderProcessing}
            onClick={closeModal}
          />
        </Box>
      </Box>
    }
    role="alertdialog"
    size="sm"
  >
    {/* Order Summary */}
    {!orderProcessing && (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        direction="column"
        padding={2}
        color="lightWash"
      >
        {cartItems.map(item => (
          <Box key={item._id} padding={1}>
            <Text size="lg" color="orcid">
              {item.name} x {item.quantity} - ${item.quantity * item.price}
            </Text>
          </Box>
        ))}
        <Box paddingY={2}>
          <Text size="lg" bold>
            Total: {calculatePrice(cartItems)}
          </Text>
        </Box>
      </Box>
    )}

    {/* Order Processing Spinner */}
    <Spinner
      show={orderProcessing}
      accessibilityLabel="Order Processing Spinner"
    />
    {orderProcessing && (
      <Text align="center" italic>
        Submitting Order...
      </Text>
    )}
  </Modal>
);

const CheckoutForm = withRouter(injectStripe(_CheckoutForm));

const Checkout = () => (
  <StripeProvider apiKey="pk_test_51IhypLFxpCIs8uTyLkOATx75ym0TJQyiDxporBAERGjYsrCbAhtQV2sxak1fVvv4Cvsx6BFRN4bXPLC7AB48JkLL00pr8cXnyd">
    <Elements>
      <CheckoutForm />
    </Elements>
  </StripeProvider>
);

export default Checkout;