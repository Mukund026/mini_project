// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {
    struct Order {
        address consumer;
        address farmer;
        uint amount;
        bool productReceived;
        bool deposited;
    }

    mapping(uint => Order) public orders; // orderId => Order

    function createOrder(uint orderId, address farmer) external {
        orders[orderId] = Order({
            consumer: msg.sender,
            farmer: farmer,
            amount: 0,
            productReceived: false,
            deposited: false
        });
    }

    function deposit(uint orderId) external payable {
        Order storage order = orders[orderId];
        require(msg.sender == order.consumer, "Only consumer can deposit");
        require(!order.deposited, "Already deposited");
        order.amount = msg.value;
        order.deposited = true;
    }

    function confirmReceipt(uint orderId) external {
        Order storage order = orders[orderId];
        require(msg.sender == order.consumer, "Only consumer can confirm");
        require(order.deposited, "No funds deposited");
        require(!order.productReceived, "Already confirmed");
        order.productReceived = true;
        payable(order.farmer).transfer(order.amount);
        order.amount = 0;
    }

    function getOrderBalance(uint orderId) external view returns(uint) {
        return orders[orderId].amount;
    }
}