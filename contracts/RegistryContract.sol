// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract AggregatorRegistry {
    struct AggregatorInfo {
        string domain;
        string did;
        string cid;
        address owner;
    }

    mapping(string => AggregatorInfo) private registryByDomain;
    mapping(address => AggregatorInfo) private registryByOwner;

    event AggregatorRegistered(address indexed owner, string indexed domain, string did, string cid);
    event AggregatorUpdated(address indexed owner, string indexed domain, string did, string cid);

    function register(string calldata domain, string calldata did, string calldata cid) external {
        require(bytes(domain).length > 0, "Domain cannot be empty");
        require(bytes(did).length > 0, "DID cannot be empty");
        require(bytes(cid).length > 0, "CID cannot be empty");
        require(registryByDomain[domain].owner == address(0), "Domain already registered");
        require(registryByOwner[msg.sender].owner == address(0), "Sender already registered a domain");

        AggregatorInfo memory info = AggregatorInfo({
            domain: domain,
            did: did,
            cid: cid,
            owner: msg.sender
        });
        registryByDomain[domain] = info;
        registryByOwner[msg.sender] = info;

        emit AggregatorRegistered(msg.sender, domain, did, cid);
    }

    function update(string calldata domain, string calldata newDid, string calldata newCid) external {
        require(bytes(domain).length > 0, "Domain cannot be empty");
        require(bytes(newCid).length > 0, "CID cannot be empty");
        require(bytes(newDid).length > 0, "DID cannot be empty");
        AggregatorInfo storage info = registryByDomain[domain];
        require(info.owner != address(0), "Domain not registered");
        require(msg.sender == info.owner, "Only owner can update");

        info.did = newDid;
        info.cid = newCid;
        registryByOwner[msg.sender].did = newDid;
        registryByOwner[msg.sender].cid = newCid;

        emit AggregatorUpdated(msg.sender, domain, newDid, newCid);
    }

    function getByDomain(string calldata domain) external view returns (string memory did, string memory cid, address owner) {
        AggregatorInfo storage info = registryByDomain[domain];
        require(info.owner != address(0), "Domain not found");
        return (info.did, info.cid, info.owner);
    }

    function getByOwner(address ownerAddr) external view returns (string memory domain, string memory did, string memory cid) {
        AggregatorInfo storage info = registryByOwner[ownerAddr];
        require(info.owner != address(0), "Address not found");
        return (info.domain, info.did, info.cid);
    }

    function isDomainRegistered(string calldata domain) external view returns (bool) {
        return registryByDomain[domain].owner != address(0);
    }

    function isOwnerOfDomain(address ownerAddr, string calldata domain) external view returns (bool) {
        return registryByDomain[domain].owner == ownerAddr;
    }
}