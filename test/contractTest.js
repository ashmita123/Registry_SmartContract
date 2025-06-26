const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AggregatorRegistry", function () {
  let registry;
  let owner, other;

  const domain = "duffel.xyz";
  const did = "did:web:duffel.xyz";
  const cid = "QmHash001";

  const newDid = "did:web:updated.duffel.xyz";
  const newCid = "QmHash002";

  beforeEach(async () => {
    [owner, other] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("AggregatorRegistry");
    registry = await Registry.deploy();
    await registry.deployed();
  });

  it("should register a new aggregator", async () => {
    await expect(registry.connect(owner).register(domain, did, cid))
      .to.emit(registry, "AggregatorRegistered")
      .withArgs(owner.address, domain, did, cid);

    const [gotDid, gotCid, gotOwner] = await registry.getByDomain(domain);
    expect(gotDid).to.equal(did);
    expect(gotCid).to.equal(cid);
    expect(gotOwner).to.equal(owner.address);

    const [gotDomain, gotDid2, gotCid2] = await registry.getByOwner(owner.address);
    expect(gotDomain).to.equal(domain);
    expect(gotDid2).to.equal(did);
    expect(gotCid2).to.equal(cid);
  });

  it("should prevent registering the same domain twice", async () => {
    await registry.connect(owner).register(domain, did, cid);
    await expect(registry.connect(other).register(domain, "did2", "cid2"))
      .to.be.revertedWith("Domain already registered");
  });

  it("should prevent the same owner from registering multiple domains", async () => {
    await registry.connect(owner).register(domain, did, cid);
    await expect(registry.connect(owner).register("other.xyz", "did2", "cid2"))
      .to.be.revertedWith("Sender already registered a domain");
  });

  it("should allow owner to update DID and CID", async () => {
    await registry.connect(owner).register(domain, did, cid);

    await expect(registry.connect(owner).update(domain, newDid, newCid))
      .to.emit(registry, "AggregatorUpdated")
      .withArgs(owner.address, domain, newDid, newCid);

    const [updatedDid, updatedCid, _] = await registry.getByDomain(domain);
    expect(updatedDid).to.equal(newDid);
    expect(updatedCid).to.equal(newCid);
  });

  it("should reject updates by non-owners", async () => {
    await registry.connect(owner).register(domain, did, cid);
    await expect(registry.connect(other).update(domain, newDid, newCid))
      .to.be.revertedWith("Only owner can update");
  });

  it("should verify domain registration status", async () => {
    expect(await registry.isDomainRegistered(domain)).to.be.false;
    await registry.connect(owner).register(domain, did, cid);
    expect(await registry.isDomainRegistered(domain)).to.be.true;
  });

  it("should verify ownership of a domain", async () => {
    await registry.connect(owner).register(domain, did, cid);
    expect(await registry.isOwnerOfDomain(owner.address, domain)).to.be.true;
    expect(await registry.isOwnerOfDomain(other.address, domain)).to.be.false;
  });

  it("should revert on getting unregistered domain or owner", async () => {
    await expect(registry.getByDomain("unregistered.xyz"))
      .to.be.revertedWith("Domain not found");

    await expect(registry.getByOwner(other.address))
      .to.be.revertedWith("Address not found");
  });
});