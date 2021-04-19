import React from 'react';
import { Box, Text, Heading, Image, Button } from 'gestalt';
import { getToken, clearToken, clearCart } from '../utils';
import { NavLink, withRouter } from "react-router-dom";

class Navbar extends React.Component {

    handleSignout = () => {
        clearToken();
        clearCart();
        this.props.history.push("/");
    };

    render() {
        return getToken() !== null ? (
            <AuthNav handleSignout={this.handleSignout} />
        ) : (
            <UnAuthNav />
        );
    }
};

const AuthNav = ({ handleSignout }) => (
    <Box
        display="flex"
        alignItems="center"
        height={120}
        justifyContent="around"
        color="eggplant"
        padding={1}
        shape="roundedBottom"
    >

        {/* Sign out Button*/}
        <Button
            onClick={handleSignout}
            color="transparent"
            text="Sign Out"
            inline
            size="md"
        />

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

        {/* Checkout link  */}
        <NavLink activeClassName="active" exact to="/checkout">
            <Text size="xl" color="white">
                Checkout
            </Text>
        </NavLink>

    </Box>
)

const UnAuthNav = () => (
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
                Sign In
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
                Sign Up
            </Text>
        </NavLink>

    </Box>
)

export default withRouter(Navbar);