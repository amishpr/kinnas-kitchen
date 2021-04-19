import React, { Component } from "react";
import { Container, Box, Heading, Card, Image, Text, SearchField, Icon, Spinner} from 'gestalt';
import { Link } from 'react-router-dom';
import "./App.css";
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || 'http://localhost:1337';
const strapi = new Strapi(apiUrl);

class App extends Component {

  state = {
    brands: [],
    searchTerm: "",
    loadingBrands: true
  }

  async componentDidMount() {

    try {
      const response = await strapi.request('POST', '/graphql', {
        data: {
          query: `query {
            brands {
              _id
              name
              description
              createdAt
              image {
                url
                name
              }
            }
          }`
        }
      });
  
      this.setState({brands: response.data.brands, loadingBrands:false});

    } catch (error) {
      console.error(error)
      this.setState({loadingBrands:false});
    }
   
  }

  handleChange = ({ value }) => {
    this.setState({ searchTerm: value });
  }

  filterBrands = ( { searchTerm, brands } ) => {

    return brands.filter(brand => {
      return brand.name.toLowerCase().includes(searchTerm.toLowerCase())
          || brand.description.toLowerCase().includes(searchTerm.toLowerCase());
    });

  }

  render() {

    const { searchTerm, loadingBrands } = this.state;

    return (
      <Container>
        {/* Search */}
        <Box display="flex" justifyContent="center" marginTop={4}>
          <SearchField
            id="searchField"
            accessibilityLabel="Brand Search Field"
            onChange={this.handleChange}
            value={searchTerm}
            placeholder="Search Brands"
          />
          <Box margin={3}>
            <Icon
              icon="filter"
              color={searchTerm ? 'orange' : 'gray'}
              size={20}
              accessibilityLabel="filter"
            />
          </Box>
        </Box>
          
        {/* Brands Section */}
        <Box
          display="flex"
          justifyContent="center"
          marginBottom={2}
        >
        
        {/* Brands Heading */}
        <Heading color="midnight" size="md">
          Brew Brands
        </Heading>
        </Box>

        {/* Brands */}
        <Box wrap display="flex" justifyContent="around">
          {this.filterBrands(this.state).map(brand => (
            <Box
              width={200}
              margin={2}
              key={brand._id}
            >
              <Card
                image = {
                  <Box height={200} width={200}>
                    <Image
                      fit="cover"
                      alt={`${brand.name}`}
                      naturalHeight={1}
                      naturalWidth={1}
                      src={`${apiUrl}${brand.image[0].url}`}
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
                  <Text bold size="xl">{brand.name}</Text>
                  <Text>{brand.description}</Text>
                  <Text bold size="xl">
                    <Link to={`/${brand._id}`}> See Brews </Link>
                  </Text>
                </Box>
           
              </Card>

            </Box>  
          ))}
        </Box>
        <Spinner
          show={loadingBrands}
          accessibilityLabel="Loading Spinner"
        />
      </Container>
    )
  }
}

export default App;
