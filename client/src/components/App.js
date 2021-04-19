import React, { Component } from "react";
import { Container, Box, Heading, Card, Image, Text, Spinner} from 'gestalt';
import { Link } from 'react-router-dom';
import "./App.css";
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class App extends Component {

  state = {
    categories: [],
    loading: true
  }

  async componentDidMount() {

    try {
      const response = await strapi.request('POST', '/graphql', {
        data: {
          query: `query {
            categories {
              _id
              name
              createdAt
              image {
                url
                name
              }
            }
          }`
        }
      });
  
      this.setState({categories: response.data.categories, loading:false});

    } catch (error) {
      console.error(error)
      this.setState({loading:false});
    }
   
  }

  handleChange = ({ value }) => {
    this.setState({ searchTerm: value });
  }

  render() {

    const { categories, loading } = this.state;

    return (
      <Container>
          
        {/* Categories Section */}
        <Box
          display="flex"
          justifyContent="center"
          marginBottom={2}
        >
        
        {/* Categories Heading */}
        <Heading color="midnight" size="md">
          Categories
        </Heading>
        </Box>

        {/* Categories */}
        <Box wrap display="flex" justifyContent="around">
          {categories.map(category => (
            <Link to={`/${category._id}`}>
            <Box
              width={200}
              margin={2}
              key={category._id}
            >
              <Card
                image = {
                  <Box height={200} width={200}>
                    <Image
                      fit="cover"
                      alt={`${category.name}`}
                      naturalHeight={1}
                      naturalWidth={1}
                      src={`${apiUrl}${category.image.url}`}
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
                  <Text bold size="xl">{category.name}</Text>
                </Box>
           
              </Card>
            </Box>
            </Link>  
          ))}
        </Box>

        <Spinner
          show={loading}
          accessibilityLabel="Loading Spinner"
        />
      </Container>
    )
  }
}

export default App;
