import React, { Component } from "react";
import "./payment-accept.css";
import Web3 from "web3";
class Acceptpay extends Component {
  state = { account: "" };

  //   getFund = () => {
  //     const { accounts, contract } = this.state;
  //     setTimeout(() => {
  //       let getFund = contract.methods
  //         .withdraw(accounts[0])
  //         .send({ from: accounts[0], gas: 300000 });
  //     }, 1);
  //   };

  async loadBlockchain() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    const network = await web3.eth.net.getNetworkType();
    console.log(network);
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
  }
  componentDidMount() {
    this.loadBlockchain();
  }

  getFund = () => {
    // const { accounts, contract } = this.state;
    //   setTimeout(() => {
    //     let getFund = contract.methods
    //       .withdraw(accounts[0])
    //       .send({ from: accounts[0], gas: 300000 });
    //   }, 1);
    console.log(this.state.account);
  };

  render() {
    return (
      <div className="payment-accept-button">
        <p>Please Accept payment</p>
        <span>
          File has been successfully <br />
          stored in your system.{" "}
        </span>
        <button onClick={this.props.getFund}>Accept</button>
      </div>
    );
  }
}

export default Acceptpay;
