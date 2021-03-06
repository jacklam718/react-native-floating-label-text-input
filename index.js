'use strict';

var React = require('react');
var ReactNative = require('react-native');
var { StyleSheet, Text, View, TextInput, Animated } = ReactNative;

var FloatingLabel = React.createClass({
  getInitialState: function() {
    var initialPadding = 9;
    var initialOpacity = 0;

    if (this.props.visible) {
      initialPadding = 5
      initialOpacity = 1
    }

    return {
      paddingAnim: new Animated.Value(initialPadding),
      opacityAnim: new Animated.Value(initialOpacity)
    };
  },

  componentWillReceiveProps: function(newProps) {
    Animated.timing(this.state.paddingAnim, {
      toValue: newProps.visible ? 5 : 9,
      duration: 230
    }).start();

    return Animated.timing(this.state.opacityAnim, {
      toValue: newProps.visible ? 1 : 0,
      duration: 230
    }).start();
  },

  render: function() {
    return(
      <Animated.View style={[styles.floatingLabel, {paddingTop: this.state.paddingAnim, opacity: this.state.opacityAnim}]}>
        {this.props.children}
      </Animated.View>
    );
  }
});

var TextFieldHolder = React.createClass({
  getInitialState: function() {
    return {
      marginAnim: new Animated.Value(this.props.withValue ? 10 : 0)
    };
  },

  componentWillReceiveProps: function(newProps) {
    return Animated.timing(this.state.marginAnim, {
      toValue: newProps.withValue ? 10 : 0,
      duration: 230
    }).start();
  },

  render: function() {
    return(
      <Animated.View style={{marginTop: this.state.marginAnim}}>
        {this.props.children}
      </Animated.View>
    );
  }
});

var FloatLabelTextField = React.createClass({
  getInitialState: function() {
    return {
      focussed: false,
      text: this.props.value
    };
  },

  componentWillReceiveProps: function(newProps) {
    if (newProps.hasOwnProperty('value') && newProps.value !== this.state.text) {
      this.setState({ text: newProps.value })
    }
  },

  withBorder: function(newStyles) {
    if (!this.props.noBorder) {
      return newStyles.withBorder ? newStyles.withBorder : styles.withBorder;
    };
  },

  onFocusWithBorder: function(newStyles) {
    if (!this.props.noBorder && this.state.focussed) {
      return newStyles.onFocusWithBorder ? newStyles.onFocusWithBorder : styles.onFocusWithBorder;
    }
  },

  render: function() {
    const newStyles = this.props.styles || {};
    return(
      <View style={[styles.container, newStyles.container]}>
        <View style={[styles.viewContainer, newStyles.viewContainer]}>
          <View style={[styles.paddingView, newStyles.paddingView]}></View>
          <View style={[styles.fieldContainer, this.withBorder(newStyles), newStyles.fieldContainer, this.onFocusWithBorder(newStyles)]}>
            <FloatingLabel visible={this.state.text}>
              <Text style={[styles.fieldLabel, newStyles.fieldLabel, this.labelStyle(newStyles)]}>{this.placeholderValue()}</Text>
            </FloatingLabel>
            <TextFieldHolder withValue={this.state.text}>
              <TextInput
                placeholder={this.props.placeholder}
                style={[styles.valueText, newStyles.valueText]}
                defaultValue={this.props.defaultValue}
                value={this.state.text}
                maxLength={this.props.maxLength}
                selectionColor={this.props.selectionColor}
                onFocus={this.setFocus}
                onBlur={this.unsetFocus}
                onChangeText={this.setText}
                secureTextEntry={this.props.secureTextEntry}
                keyboardType={this.props.keyboardType}
                autoCapitalize={this.props.autoCapitalize}
                autoCorrect={this.props.autoCorrect}
              />
            </TextFieldHolder>
          </View>
        </View>
      </View>
    );
  },
  setFocus: function() {
    // this.props.styles.container = {backgroundColor: 'red'};

    this.setState({
      focussed: true
    });
    try {
      return this.props.onFocus.call(this);
    } catch (_error) {}
  },

  unsetFocus: function() {
    this.setState({
      focussed: false
    });
    try {
      return this.props.onBlur.call(this);
    } catch (_error) {}
  },

  labelStyle: function(newStyles) {
    if (this.state.focussed) {
      return newStyles.focussed ? newStyles.focussed : styles.focussed;
    }
  },

  placeholderValue: function() {
    if (this.state.text) {
      return this.props.placeholder;
    }
  },

  setText: function(value) {
    this.setState({
      text: value
    });
    try {
      return this.props.onChangeTextValue.call(this, value);
    } catch (_error) {}
  },

  withMargin: function() {
    if (this.state.text) {
      return styles.withMargin;
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 45,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  paddingView: {
    // width: 15
  },
  floatingLabel: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  fieldLabel: {
    height: 10,
    fontSize: 9,
    color: '#B1B1B1'
  },
  fieldContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative'
  },
  withBorder: {
    borderBottomWidth: 1 / 2,
    borderColor: '#C8C7CC',
  },
  onFocusWithBorder: {
  },
  valueText: {
    height: 20,
    fontSize: 16,
    color: '#111111'
  },
  withMargin: {
    marginTop: 10
  },
  focussed: {
    color: "#1482fe"
  }
});

module.exports = FloatLabelTextField
