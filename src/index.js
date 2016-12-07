/* eslint-disable no-return-assign, no-unused-vars */
import React, { Component, PropTypes } from 'react'
import { Dimensions, Modal, TouchableWithoutFeedback , View } from 'react-native'
var ViewAnimatable = require('react-native-animatable').View;

import styles from './index.style.js'

export class AnimatedModal extends Component {
  static propTypes = {
    animationIn: PropTypes.string,
    animationInTiming: PropTypes.number,
    animationOut: PropTypes.string,
    animationOutTiming: PropTypes.number,
    backdropColor: PropTypes.string,
    backdropOpacity: PropTypes.number,
    backdropTransitionInTiming: PropTypes.number,
    backdropTransitionOutTiming: PropTypes.number,
    children: PropTypes.node.isRequired,
    isVisible: PropTypes.bool.isRequired,
    onModalShow: PropTypes.func,
    onModalHide: PropTypes.func,
    style: PropTypes.any
  }

  static defaultProps = {
    animationIn: 'slideInUp',
    animationInTiming: 300,
    animationOut: 'slideOutDown',
    animationOutTiming: 300,
    backdropColor: 'black',
    backdropOpacity: 0.70,
    backdropTransitionInTiming: 300,
    backdropTransitionOutTiming: 300,
    onModalShow: () => null,
    onModalHide: () => null,
    isVisible: false
  }

  state = {
    isVisible: false,
    deviceWidth: Dimensions.get('window').width,
    deviceHeight: Dimensions.get('window').height
  }

  componentWillReceiveProps (nextProps) {
    if (!this.state.isVisible && nextProps.isVisible) {
      this.setState({ isVisible: true })
    }
  }

  componentDidUpdate (prevProps, prevState) {
    // On modal open request slide the view up and fade in the backdrop
    if (this.state.isVisible && !prevState.isVisible) {
      this._open()
    // On modal close request slide the view down and fade out the backdrop
    } else if (!this.props.isVisible && prevProps.isVisible) {
      this._close()
    }
  }

  _open = () => {
    // this.backdropRef.transitionTo({ opacity: this.props.backdropOpacity }, this.props.backdropTransitionInTiming)
    this.contentRef[this.props.animationIn](this.props.animationInTiming)
      .then(() => {
        this.props.onModalShow()
      })
  }

  _close = async () => {
    // this.backdropRef.transitionTo({ opacity: 0 }, this.props.backdropTransitionOutTiming)
    this.contentRef[this.props.animationOut](this.props.animationOutTiming)
      .then(() => {
        this.setState({ isVisible: false })
        this.props.onModalHide()
      })
  }

  _handleLayout = (event) => {
    const deviceWidth = Dimensions.get('window').width
    const deviceHeight = Dimensions.get('window').height
    if (deviceWidth !== this.state.deviceWidth || deviceHeight !== this.state.deviceHeight) {
      this.setState({ deviceWidth, deviceHeight })
    }
  }

  render () {
    const { animationIn, animationInTiming, animationOut, animationOutTiming, backdropColor,
      backdropOpacity, backdropTransitionInTiming, backdropTransitionOutTiming, children, isVisible,
      onModalShow, onModalHide, style, ...otherProps } = this.props
    const { deviceWidth, deviceHeight } = this.state
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={this.state.isVisible}
        onRequestClose={this._close}
        {...otherProps}
      >
        <TouchableWithoutFeedback style = { { justifyContent:'center', alignItems:'center'} }  onPress={this._close}>
          <ViewAnimatable
          onLayout={this._handleLayout}
          ref={(ref) => this.backdropRef = ref}
          style={[
            styles.backdrop,
            { backgroundColor: backdropColor, width: deviceWidth, height: deviceHeight }
          ]}
        />
        </TouchableWithoutFeedback >
        <View pointerEvents='box-none'  style = { {flex:1,justifyContent:'center', alignItems:'center'} } >
          <ViewAnimatable
          ref={(ref) => this.contentRef = ref}
          style={[{  }, styles.content, style]}
          {...otherProps}>
          {children}
        </ViewAnimatable>
        </View>
      </Modal>
    )
  }
}

export default AnimatedModal
