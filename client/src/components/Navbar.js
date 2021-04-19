import React from 'react';
import { Box, Text, Heading, Image } from 'gestalt';
import { NavLink } from 'react-router-dom';

const Navbar = () => (
    <Box
        display="flex"
        alignItems="center"
        height={120}
        justifyContent="around"
        color="eggplant"
        padding={1}
        shape="roundedBottom"
    >
        {/* Sign in link  */}
        <NavLink activeClassName="active" exact to="/signin">
            <Text size="xl" color="white">
                Signin
            </Text>
        </NavLink>

        {/* Title and Logo */}
        <NavLink activeClassName="active" exact to="/">
            <Box display="flex" alignItems="center">
                <Box margin={2} height={80} width={80}>
                    <Image 
                        alt="Kinna's Kitchen Logo"
                        naturalHeight={1}
                        naturalWidth={1}
                        src="./icons/logo.svg"
                    />
                </Box>
                <Heading size="xs" color="white">
                    Kinna's Kitchen
                </Heading>
            </Box>
        </NavLink>

        {/* Sign up link*/}
        <NavLink activeClassName="active" exact to="/signup">
            <Text size="xl" color="white">
                Signup
            </Text>
        </NavLink>

    </Box>
)

export default Navbar;