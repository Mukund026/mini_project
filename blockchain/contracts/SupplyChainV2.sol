// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChainV2 {
    struct Trace {
        address actor;
        uint256 timestamp;
        uint256 quantity;
        uint256 pricePerUnit;
        string quality;
        string metaUri;
    }

    struct Product {
        address currentOwner;
        address origin;
        string name;
        string category;
        uint256 createdAt;
        Trace[] traces;
        bool exists;
    }

    struct Order {
        bytes32 productId;
        address buyer;
        address seller;
        uint256 quantity;
        uint256 totalPrice;
        uint256 escrowAmount;
        OrderStatus status;
        uint256 createdAt;
        uint256 deliveredAt;
    }

    enum OrderStatus {
        Created,
        Paid,
        Shipped,
        Delivered,
        Cancelled,
        Refunded
    }

    mapping(bytes32 => Product) private products;
    mapping(bytes32 => Order) private orders;
    mapping(address => uint256) private balances; // For escrow refunds

    // Events
    event ProductCreated(
        bytes32 indexed productId,
        address indexed origin,
        string name
    );
    event TraceAdded(
        bytes32 indexed productId,
        address indexed actor,
        uint256 timestamp
    );
    event OwnershipTransferred(
        bytes32 indexed productId,
        address indexed oldOwner,
        address indexed newOwner
    );
    event OrderCreated(
        bytes32 indexed orderId,
        bytes32 indexed productId,
        address indexed buyer,
        address seller,
        uint256 totalPrice
    );
    event PaymentReceived(
        bytes32 indexed orderId,
        address indexed buyer,
        uint256 amount
    );
    event OrderShipped(bytes32 indexed orderId, address indexed seller);
    event OrderDelivered(
        bytes32 indexed orderId,
        address indexed buyer,
        address seller
    );
    event OrderCancelled(bytes32 indexed orderId, address indexed buyer);
    event RefundProcessed(
        bytes32 indexed orderId,
        address indexed buyer,
        uint256 amount
    );

    // Constructor
    constructor() {}

    modifier productExists(bytes32 productId) {
        require(products[productId].exists, "Product not found");
        _;
    }

    modifier orderExists(bytes32 orderId) {
        require(
            orders[orderId].status != OrderStatus.Created ||
                orders[orderId].buyer != address(0),
            "Order not found"
        );
        _;
    }

    modifier onlyBuyer(bytes32 orderId) {
        require(
            msg.sender == orders[orderId].buyer,
            "Only buyer can perform this action"
        );
        _;
    }

    modifier onlySeller(bytes32 orderId) {
        require(
            msg.sender == orders[orderId].seller,
            "Only seller can perform this action"
        );
        _;
    }

    // Product Management Functions
    function createProduct(
        bytes32 productId,
        string calldata name,
        string calldata category,
        uint256 initialQuantity,
        uint256 pricePerUnit,
        string calldata quality,
        string calldata metaUri
    ) external {
        require(!products[productId].exists, "Product already exists");

        Product storage p = products[productId];
        p.exists = true;
        p.currentOwner = msg.sender;
        p.origin = msg.sender;
        p.name = name;
        p.category = category;
        p.createdAt = block.timestamp;

        Trace memory initialTrace = Trace({
            actor: msg.sender,
            timestamp: block.timestamp,
            quantity: initialQuantity,
            pricePerUnit: pricePerUnit,
            quality: quality,
            metaUri: metaUri
        });

        p.traces.push(initialTrace);

        emit ProductCreated(productId, msg.sender, name);
        emit TraceAdded(productId, msg.sender, block.timestamp);
    }

    function addTrace(
        bytes32 productId,
        uint256 quantity,
        uint256 pricePerUnit,
        string calldata quality,
        string calldata metaUri
    ) external productExists(productId) {
        Product storage p = products[productId];
        require(msg.sender == p.currentOwner, "Only owner can add trace");

        Trace memory t = Trace({
            actor: msg.sender,
            timestamp: block.timestamp,
            quantity: quantity,
            pricePerUnit: pricePerUnit,
            quality: quality,
            metaUri: metaUri
        });

        p.traces.push(t);

        emit TraceAdded(productId, msg.sender, block.timestamp);
    }

    function transferOwnership(
        bytes32 productId,
        address newOwner,
        uint256 quantity,
        uint256 pricePerUnit,
        string calldata quality,
        string calldata metaUri
    ) external productExists(productId) {
        Product storage p = products[productId];
        address oldOwner = p.currentOwner;
        require(msg.sender == oldOwner, "Only owner can transfer");

        p.currentOwner = newOwner;

        Trace memory t = Trace({
            actor: msg.sender,
            timestamp: block.timestamp,
            quantity: quantity,
            pricePerUnit: pricePerUnit,
            quality: quality,
            metaUri: metaUri
        });

        p.traces.push(t);

        emit OwnershipTransferred(productId, oldOwner, newOwner);
        emit TraceAdded(productId, msg.sender, block.timestamp);
    }

    // Order Management Functions
    function createOrder(
        bytes32 orderId,
        bytes32 productId,
        address seller,
        uint256 quantity,
        uint256 totalPrice
    ) external productExists(productId) {
        require(msg.sender != seller, "Buyer cannot be the seller");
        require(orders[orderId].buyer == address(0), "Order already exists");

        Order storage o = orders[orderId];
        o.productId = productId;
        o.buyer = msg.sender;
        o.seller = seller;
        o.quantity = quantity;
        o.totalPrice = totalPrice;
        o.status = OrderStatus.Created;
        o.createdAt = block.timestamp;

        emit OrderCreated(orderId, productId, msg.sender, seller, totalPrice);
    }

    function payForOrder(
        bytes32 orderId
    ) external payable orderExists(orderId) onlyBuyer(orderId) {
        Order storage o = orders[orderId];
        require(
            o.status == OrderStatus.Created,
            "Order must be in Created status to pay"
        );
        require(
            msg.value == o.totalPrice,
            "Payment amount must match total price"
        );

        o.status = OrderStatus.Paid;
        o.escrowAmount = msg.value;

        emit PaymentReceived(orderId, msg.sender, msg.value);
    }

    function confirmOrder(
        bytes32 orderId
    ) external orderExists(orderId) onlySeller(orderId) {
        Order storage o = orders[orderId];
        require(
            o.status == OrderStatus.Paid,
            "Order must be paid before confirmation"
        );
        // Additional confirmation logic can be added here
    }

    function shipOrder(
        bytes32 orderId
    ) external orderExists(orderId) onlySeller(orderId) {
        Order storage o = orders[orderId];
        require(
            o.status == OrderStatus.Paid,
            "Order must be paid before shipping"
        );

        o.status = OrderStatus.Shipped;

        emit OrderShipped(orderId, msg.sender);
    }

    function deliverOrder(
        bytes32 orderId
    ) external orderExists(orderId) onlySeller(orderId) {
        Order storage o = orders[orderId];
        require(
            o.status == OrderStatus.Shipped,
            "Order must be shipped before delivery"
        );

        o.status = OrderStatus.Delivered;
        o.deliveredAt = block.timestamp;

        // Release payment from escrow to seller
        payable(o.seller).transfer(o.escrowAmount);
        o.escrowAmount = 0;

        emit OrderDelivered(orderId, o.buyer, o.seller);
    }

    function cancelOrder(bytes32 orderId) external orderExists(orderId) {
        Order storage o = orders[orderId];
        require(
            msg.sender == o.buyer || msg.sender == o.seller,
            "Only buyer or seller can cancel"
        );
        require(
            o.status == OrderStatus.Created || o.status == OrderStatus.Paid,
            "Order cannot be cancelled at this stage"
        );

        o.status = OrderStatus.Cancelled;

        // Process refund if payment was made
        if (o.escrowAmount > 0) {
            payable(o.buyer).transfer(o.escrowAmount);
            o.escrowAmount = 0;
            emit RefundProcessed(orderId, o.buyer, o.escrowAmount);
        }

        emit OrderCancelled(orderId, o.buyer);
    }

    // View Functions
    function getProduct(
        bytes32 productId
    )
        external
        view
        productExists(productId)
        returns (
            address currentOwner,
            address origin,
            string memory name,
            string memory category,
            uint256 createdAt,
            uint256 traceCount
        )
    {
        Product storage p = products[productId];
        return (
            p.currentOwner,
            p.origin,
            p.name,
            p.category,
            p.createdAt,
            p.traces.length
        );
    }

    function getOrder(
        bytes32 orderId
    )
        external
        view
        orderExists(orderId)
        returns (
            bytes32 productId,
            address buyer,
            address seller,
            uint256 quantity,
            uint256 totalPrice,
            uint256 escrowAmount,
            OrderStatus status,
            uint256 createdAt,
            uint256 deliveredAt
        )
    {
        Order storage o = orders[orderId];
        return (
            o.productId,
            o.buyer,
            o.seller,
            o.quantity,
            o.totalPrice,
            o.escrowAmount,
            o.status,
            o.createdAt,
            o.deliveredAt
        );
    }

    function getPaymentStatus(
        bytes32 orderId
    )
        external
        view
        orderExists(orderId)
        returns (
            OrderStatus status,
            uint256 escrowAmount,
            bool isPaid,
            bool isDelivered
        )
    {
        Order storage o = orders[orderId];
        return (
            o.status,
            o.escrowAmount,
            o.status >= OrderStatus.Paid,
            o.status == OrderStatus.Delivered
        );
    }

    function getTrace(
        bytes32 productId,
        uint256 index
    )
        external
        view
        productExists(productId)
        returns (
            address actor,
            uint256 timestamp,
            uint256 quantity,
            uint256 pricePerUnit,
            string memory quality,
            string memory metaUri
        )
    {
        Product storage p = products[productId];
        require(index < p.traces.length, "Index out of bounds");
        Trace storage t = p.traces[index];
        return (
            t.actor,
            t.timestamp,
            t.quantity,
            t.pricePerUnit,
            t.quality,
            t.metaUri
        );
    }

    function getAllTraces(
        bytes32 productId
    ) external view productExists(productId) returns (Trace[] memory) {
        return products[productId].traces;
    }

    // Utility function to get contract balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
