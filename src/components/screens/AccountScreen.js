import React, {Component} from 'react';
import {StyleSheet, Image} from 'react-native';
import {View, Button, Text} from 'native-base';
import {connect} from 'react-redux';
import * as actionType from './../../redux/actionType';
import {AsyncStorage} from 'react-native';
import Avatar from './../../../images/avatar.png';

class AccountScreen extends Component {
  static navigationOptions = {
    title: 'Account',
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      user: null,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('user').then(user => {
      this.setState({
        isLoading: false,
        user: JSON.parse(user),
      });
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }
    return (
      <View style={styles.big}>
        <View style={styles.layout}>
          <Image
            style={styles.picture}
            width={370}
            height={200}
            marginTop={20}
            source={Avatar}
          />
          <Text flex={1} style={styles.username}>
            {this.state.user.fullname}
          </Text>
        </View>
        <View style={styles.layout2}>
          <Button style={styles.button} onPress={this.changepasswordTapped}>
            <Text style={styles.text}>Change password</Text>
          </Button>

          <Button style={styles.button} onPress={this.feedbackTapped}>
            <Text style={styles.text}>Feedback</Text>
          </Button>

          <Button style={styles.button} onPress={this.logoutTapped}>
            <Text style={styles.text}>Logout</Text>
          </Button>
        </View>
      </View>
    );
  }

  changepasswordTapped = async () => {};

  feedbackTapped = async () => {};

  logoutTapped = async () => {
    this.gotoLoginScreen();
  };

  gotoLoginScreen = () => {
    this.props.navigation.push('Login');
  };

  getUser = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user !== null) {
        return JSON.parse(user);
      }
    } catch (error) {
      console.log(error);
    }
  };
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: '#f28080',
  },
  layout2: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    backgroundColor: '#f28080',
    justifyContent: 'center',
    margin: 20,
    textTransform: 'none',
    borderRadius: 45,
  },
  text: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    padding: 10,
  },
  big: {
    backgroundColor: '#f000',
    flex: 1,
  },
  picture: {
    alignSelf: 'center',
    alignItems: 'center',
    flex: 1,
    height: 100,
    resizeMode: 'stretch',
  },
});
// export default class AccountImage extends Component {
//     render() {
//         return (
//             <View>
//                 <Image source={require('./../../../images/account.png')} />
//             </View>
//         );
//     }
// }

const mapDispatchToProps = dispatch => {
  return {
    removeScannedPage: (page: Page) =>
      dispatch({type: actionType.ACTION_REMOVE_PAGE, page: page}),
    updateScannedPage: (page: Page) =>
      dispatch({type: actionType.ACTION_UPDATE_OR_ADD_PAGE, page: page}),
  };
};

export default connect(null, mapDispatchToProps)(AccountScreen);
