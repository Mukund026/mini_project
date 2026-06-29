// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {
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

    mapping(bytes32 => Product) private products;

    // Events
    event ProductCreated(bytes32 indexed productId, address indexed origin, string name);
    event TraceAdded(bytes32 indexed productId, address indexed actor, uint256 timestamp);
    event OwnershipTransferred(bytes32 indexed productId, address indexed oldOwner, address indexed newOwner);

    // Constructor
    constructor() {}

    modifier productExists(bytes32 productId) {
        require(products[productId].exists, "Product not found");
        _;
    }

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

        // Create trace in memory before pushing
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

    function getProduct(bytes32 productId) external view productExists(productId) returns (
        address currentOwner,
        address origin,
        string memory name,
        string memory category,
        uint256 createdAt,
        uint256 traceCount
    ) {
        Product storage p = products[productId];
        return (p.currentOwner, p.origin, p.name, p.category, p.createdAt, p.traces.length);
    }

    function getTrace(bytes32 productId, uint256 index) external view productExists(productId) returns (
        address actor,
        uint256 timestamp,
        uint256 quantity,
        uint256 pricePerUnit,
        string memory quality,
        string memory metaUri
    ) {
        Product storage p = products[productId];
        require(index < p.traces.length, "Index out of bounds");
        Trace storage t = p.traces[index];
        return (t.actor, t.timestamp, t.quantity, t.pricePerUnit, t.quality, t.metaUri);
    }

    function getAllTraces(bytes32 productId) external view productExists(productId) returns (Trace[] memory) {
        return products[productId].traces;
    }
}
