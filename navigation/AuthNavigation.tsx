import {Component} from "react";
import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import * as React from "react";
import NotFoundScreen from "../screens/NotFoundScreen";
import {createStackNavigator} from "@react-navigation/stack";
import {AuthStackParamList} from "../types";
import SignUp from "../screens/SignUp";
import SignIn from "../screens/SignIn";
import AuthHome from "../screens/AuthHome";

export default class AuthNavigation extends Component {
	render() {
		return (
			<NavigationContainer
				theme={DefaultTheme}>
				<AuthNavigator/>
			</NavigationContainer>
		);
	}
}


const Stack = createStackNavigator<AuthStackParamList>();

function AuthNavigator() {
	return (
		<Stack.Navigator screenOptions={{headerShown: false}}>
			<Stack.Screen name="AuthHomeScreen" component={AuthHome} />
			<Stack.Screen name="SignUpScreen" component={SignUp}/>
			<Stack.Screen name="SignInScreen" component={SignIn}/>
			<Stack.Screen name="NotFound" component={NotFoundScreen} options={{title: 'Oops!'}}/>
		</Stack.Navigator>
	);
}
