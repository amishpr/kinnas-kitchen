import React from 'react';
import { Box, Heading, Card, Image, Text, Button, Mask, IconButton} from 'gestalt';
import { calculatePrice, setCart, getCart } from '../utils';
import { Link } from 'react-router-dom';
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);



class Foods extends React.Component {

    state = {
        foods: [],
        category: "",
        cartItems: []
    }


    async componentDidMount() {
        try {
            const response = await strapi.request('POST', 'graphql', {
                data: {
                    query: `query {
                        category(id: "${this.props.match.params.categoryId}") {
                          _id
                        name
                        foods {
                          _id
                          name
                          description
                          image {
                            url
                          }
                          price
                        }
                      }
                    }`
                }
            })
            this.setState({
                foods: response.data.category.foods,
                category: response.data.category.name,
                cartItems: getCart()
            });
        } catch (err) {
            console.error(err);
        }

    }

    addToCart = food => {
        const alreadyInCart = this.state.cartItems.findIndex(item => item._id === food._id);

        if (alreadyInCart === -1) {
            const updatedItems = this.state.cartItems.concat({
                ...food,
                quantity: 1
            });
            this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
        } else {
            const updatedItems = [...this.state.cartItems];
            updatedItems[alreadyInCart].quantity += 1;
            this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
        }
    }

    deleteItemFromCart = itemToDeleteId => {
        const filteredItems = this.state.cartItems.filter(item => item._id !== itemToDeleteId);
        this.setState({ cartItems: filteredItems }, () => setCart(filteredItems));
    }


    render() {

        const { category, foods, cartItems } = this.state;

        return (
          <Box
            wrap
            marginTop={4}
            display="flex"
            justifyContent="center"
            alignItems="start"
          >
            {/* Foods Sections */}
            <Box display="flex" direction="column" alignItems="center">
                {/* Foods Heading */}
                <Box margin={2}>
                    <Heading color="orchid">{category}</Heading>
                </Box>
                {/* Foods */}
                <Box
                    shape="rounded"
                    display="flex"
                    justifyContent="center"
                    padding={4}
                >
                    {foods.map(food => (
                         <Box
                         width={210}
                         margin={2}
                         key={food._id}
                         paddingY={4}
                       >
                         <Card
                           image = {
                             <Box height={250} width={200}>
                               <Image
                                 fit="cover"
                                 alt={`${food.name}`}
                                 naturalHeight={1}
                                 naturalWidth={1}
                                 src={`${apiUrl}${food.image.url}`}
                               />
                             </Box>
                           }
                         >
                           <Box
                             display="flex"
                             alignItems="center"
                             justifyContent="center"
                             direction="column"
                           >
                            <Box marginBottom={2}>
                                <Text bold size="xl">{food.name}</Text>
                            </Box>
                             
                             <Text>{food.description}</Text>
                             <Text color="orchid">${food.price}</Text>
                             <Box marginTop={2}>
                                <Text bold size="xl">
                                    <Button onClick={() => this.addToCart(food)} color="blue" text="Add to Order"></Button>
                                </Text>
                             </Box>
                           </Box>
                      
                         </Card>
           
                       </Box>  
                    ))}
                </Box>
            </Box>

            {/* User Cart */}
            <Box marginTop={2} marginLeft={8}>
                <Mask shape="rounded" wash>
                    <Box display="flex" direction="column" alignItems="center" padding={2}>
                        {/* User Cart Heading */}
                        <Heading align="center" size="sm">Your Cart</Heading>
                        <Text color="gray" italic>
                            {cartItems.length} items selected
                        </Text>

                        {/* Cart Items */}
                        {cartItems.map(item => (
                            <Box key={item._id} display="flex" alignItems="center">
                                <Text>
                                    {item.name} x {item.quantity} - ${(item.quantity * item.price).toFixed(2)}
                                </Text>
                                <IconButton
                                    accessibilityLabel="Delete Item"
                                    icon="cancel"
                                    size="sm"
                                    color="red"
                                    onClick={() => this.deleteItemFromCart(item._id)}
                                />
                            </Box>

                        ))}

                        <Box display="flex" alignItems="center" justifyContent="center" direction="column">
                           <Box margin={2}>
                                {cartItems.length === 0 && (
                                    <Text color="red">Please select some items</Text>
                                )}
                           </Box>
                           <Text size="lg">Total: {calculatePrice(cartItems)}</Text>
                           <Text>
                               <Link to="/checkout"></Link>
                           </Text>
                        </Box>
                    </Box>
                </Mask>

            </Box>

          </Box>
            
        );
    }
}

export default Foods;