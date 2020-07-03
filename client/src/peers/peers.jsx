import React, { Component } from "react";
import "./peers.css";

import logoIcon from "../asserts/side-bar/logo.png";
import userIcon from "../asserts/side-bar/user-icon.png";
import walletIcon from "../asserts/side-bar/wallet-icon-filled.png";
import Acceptpay from "./payment-accept";
//import ImgBtn from "../content-section/reusable-components/button/img-btn/img-btn";
//import packages
import SolidityDriveContract from "../contracts/SolidityDrive.json";
import getWeb3 from "../utils/getWeb3";
import TransactionSection from "../content-section/users/transaction-section/transaction-section";

class Peers extends Component {
  state = {
    selectedAccount: {},
    web3: null,
    accounts: null,
    contract: null,
    dropdownMenu: {
      id: 1,
      name: "account",
      dropdownActive: false,
      selectedAcc: {
        // id: "0x0591c3661c044427fBA199124cBEB745116432D2",
        // spendAmount: "5.0",
        // active: true,
        // balance: "100.0",
        // files: [
        //   {
        //     id: 1,
        //     details: {
        //       name: "chatbot",
        //       type: "txt",
        //       size: "4 KB",
        //       createDate: "19/02/2020",
        //       lastOpened: "20/02/2020",
        //     },
        //     transaction: {
        //       amount: "0.0025ETH",
        //       date: "19/02/2020",
        //       from: "0x0591c3661c044427fBA199124cBEB745116432D2",
        //     },
        //     active: false,
        //   },
        //   {
        //     id: 2,
        //     details: {
        //       name: "Latex4_zip (1)",
        //       type: "pdf",
        //       size: "1 MB",
        //       lastOpened: "18/02/2020",
        //       createDate: "19/02/2020",
        //     },
        //     transaction: {
        //       amount: "0.0025ETH",
        //       date: "19/02/2020",
        //       from: "0x0591c3661c044427fBA199124cBEB745116432D2",
        //     },
        //     active: false,
        //   },
        // ],
      },
      dropdown: [
        // {
        //   id: "0x0591c3661c044427fBA199124cBEB745116432D2",
        //   spendAmount: "5.0",
        //   active: true,
        //   balance: "100.0",
        //   files: [
        //     {
        //       id: 1,
        //       details: {
        //         name: "chatbot",
        //         type: "txt",
        //         size: "4 KB",
        //         createDate: "19/02/2020",
        //         lastOpened: "20/02/2020",
        //       },
        //       transaction: {
        //         amount: "0.0025ETH",
        //         date: "19/02/2020",
        //         from: "0x0591c3661c044427fBA199124cBEB745116432D2",
        //       },
        //       active: false,
        //     },
        //     {
        //       id: 2,
        //       details: {
        //         name: "Latex4_zip (1)",
        //         type: "pdf",
        //         size: "1 MB",
        //         lastOpened: "18/02/2020",
        //         createDate: "19/02/2020",
        //       },
        //       transaction: {
        //         amount: "0.0025ETH",
        //         date: "19/02/2020",
        //         from: "0x0591c3661c044427fBA199124cBEB745116432D2",
        //       },
        //       active: false,
        //     },
        //   ],
        // },
      ],
    },
  };

  handleTabImgBtnClick() {
    return 1;
  }
  getImgBtnClasses() {
    //const status = this.props.button.active;
    const status = true;
    if (status) {
      return "tab-img-btn-active";
    } else {
      return "tab-img-btn";
    }
  }

  componentWillMount = async () => {
    try {
      // Geting network provider and web3 instance.
      const web3 = await getWeb3();
      // Using web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // console.log(accounts);

      // Geting the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SolidityDriveContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SolidityDriveContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      let dropdownMenu = this.state.dropdownMenu;
      // console.log(dropdownMenu);
      dropdownMenu = await this.settingDropdownMenu(web3, accounts);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState(
        {
          web3,
          accounts,
          contract: instance,
          dropdownMenu,
        },
        this.getFiles
      );

      web3.currentProvider.publicConfigStore.on("update", async () => {
        const changedAccounts = await web3.eth.getAccounts();
        dropdownMenu = await this.settingDropdownMenu(web3, changedAccounts);
        this.setState(
          { accounts: changedAccounts, dropdownMenu },
          this.getFiles
        );
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  settingDropdownMenu = async (web3, accounts) => {
    var dropdownMenu = this.state.dropdownMenu;

    for (let index = 0; index < accounts.length; index++) {
      let balance = 0.0;
      await web3.eth.getBalance(accounts[index]).then((result) => {
        balance = web3.utils.fromWei(result, "ether");
      });
      if (index === 0) {
        dropdownMenu.selectedAcc = {
          id: index,
          value: accounts[index],
          balance: balance,
          active: index === 0 ? true : false,
        };
      }
      dropdownMenu.dropdown.push({
        id: index,
        value: accounts[index],
        balance: balance,
        active: index === 0 ? true : false,
      });
    }

    dropdownMenu.dropdown = await this.getUniqueAccounts(
      dropdownMenu.dropdown,
      dropdownMenu.selectedAcc
    );

    return dropdownMenu;
  };

  getUniqueAccounts = async (dropdown, selectedAcc) => {
    var uniqueDropdown = [{}];

    if (dropdown.length === 1) {
      return dropdown;
    }
    console.log(dropdown);
    // Loop through array values
    for (var index = 0; index < dropdown.length; index++) {
      if (index === 0) {
        if (dropdown[index].value !== undefined) {
          dropdown[index].id = index;
          dropdown[index].active =
            dropdown[index].value === selectedAcc.value ? true : false;
          uniqueDropdown.push(dropdown[index]);
        }
      } else {
        if (
          dropdown[index - 1].value !== dropdown[index].value &&
          dropdown[index] !== undefined &&
          dropdown[index].value !== undefined
        ) {
          dropdown[index].id = index;
          dropdown[index].active =
            dropdown[index].value === selectedAcc.value ? true : false;
          uniqueDropdown.push(dropdown[index]);
        }
      }
    }

    uniqueDropdown = uniqueDropdown.filter((item) => item.value !== undefined);
    return uniqueDropdown;
  };

  getFiles = async () => {
    try {
      const { dropdownMenu, contract } = this.state;

      for (
        let accountIndex = 0;
        accountIndex < dropdownMenu.dropdown.length;
        accountIndex++
      ) {
        let spendAmount = 0.0;
        let filesCount = await contract.methods
          .getLength()
          .call({ from: dropdownMenu.dropdown[accountIndex].value });
        let files = [];
        for (let fileIndex = 0; fileIndex < filesCount; fileIndex++) {
          let file = await contract.methods
            .getFile(fileIndex)
            .call({ from: dropdownMenu.dropdown[accountIndex].value });

          let formatedFile = {};
          formatedFile.id = file.hash;
          formatedFile.details = {
            name: file.fileName,
            type: file.fileType,
            size: "--",
            lastOpened: file.date,
            createDate: file.date,
          };
          formatedFile.transaction = {
            amount: file.amount,
            date: file.date,
            from: dropdownMenu.dropdown[accountIndex].value,
          };
          spendAmount += file.amount;
          formatedFile.active = false;
          files.push(formatedFile);
        }

        if (
          dropdownMenu.dropdown[accountIndex].value ===
          dropdownMenu.selectedAcc.value
        ) {
          dropdownMenu.selectedAcc = dropdownMenu.dropdown[accountIndex];
        }

        dropdownMenu.dropdown[accountIndex].spendAmount = spendAmount
          ? String(spendAmount)
          : "--";
        dropdownMenu.dropdown[accountIndex].files = files;
      }

      console.log(dropdownMenu);
      this.setState({
        dropdownMenu,
      });
    } catch (error) {
      console.log(error);
    }
  };

  //toggle acc dropdown
  toggleDropdownMenu = () => {
    let dropdownMenu = this.state.dropdownMenu;
    dropdownMenu.dropdownActive = dropdownMenu.dropdownActive ? false : true;
    this.setState({ dropdownMenu });
  };

  //handle acc click
  handleDropdownItemClick = (clickItem) => {
    const scope = this;
    let dropdownMenu = this.state.dropdownMenu;
    dropdownMenu.dropdown.map((dropdown) => {
      if (
        (dropdown.value === clickItem.value && !dropdown.active) ||
        (dropdown.value === clickItem.value && dropdown.active)
      ) {
        dropdown.active = true;
        dropdownMenu.selectedAcc = clickItem;
      } else {
        dropdown.active = false;
      }
      return dropdown;
    });

    setTimeout(() => {
      scope.toggleDropdownMenu();
    }, 100);

    this.setState({ dropdownMenu });
  };

  getnewFund = () => {
    const { accounts, contract } = this.state;
    setTimeout(() => {
      let getFund = contract.methods
        .withdraw(accounts[0])
        .send({ from: accounts[0], gas: 300000 });
    }, 1);
    // console.log("We will get fund");
  };

  render() {
    return (
      <div className="peers-section">
        <div className="sidebar">
          <div className="logo">
            <img src={logoIcon} alt="logo" />
          </div>
          <div className="tab-container">
            <button
              className={this.getImgBtnClasses()}
              onClick={this.handleTabImgBtnClick}
            >
              <img src={walletIcon} alt={"wallet"} />
            </button>
          </div>
          <div className="user">
            <img src={userIcon} alt="user" />
          </div>
        </div>
        <div className="peers-content-section">
          {/* <h1>All Transaction</h1> */}
          <TransactionSection
            account={this.state.dropdownMenu.selectedAcc}
            dropdownMenu={this.state.dropdownMenu}
            toggleDropdownMenu={this.toggleDropdownMenu}
            handleDropdownItemClick={this.handleDropdownItemClick}
          />
          <Acceptpay getFund={this.getnewFund} />
        </div>
      </div>
    );
  }
}

export default Peers;
