pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract MyToken is ERC20, ERC20Burnable, ERC20Permit, Ownable, AccessControl, Pausable, ReentrancyGuard {
    // Define roles for admin, minter, and pauser
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    constructor( 
        // uint256 initialSupply,
        address initialOwner
    ) ERC20("NEYX01", "NEYX_T1") ERC20Permit("NEYX01") Ownable(initialOwner) {
        // Assign deployer as the initial owner and roles
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(MINTER_ROLE, initialOwner);
        _grantRole(PAUSER_ROLE, initialOwner);

        // // Mint the initial supply to the deployer
        // _mint(initialOwner, initialSupply);
    }

    // Mint tokens, restricted to MINTER_ROLE
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    // Pause transfers, restricted to PAUSER_ROLE
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    // Unpause transfers, restricted to PAUSER_ROLE
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // Transfer admin role to another address (e.g., multisig)
    function transferAdminRole(address newAdmin) public onlyOwner nonReentrant {
        require(newAdmin != address(0), "New admin cannot be the zero address");
        // Grant the new admin role
        grantRole(DEFAULT_ADMIN_ROLE, newAdmin);
        // Revoke admin role from the current admin
        revokeRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Hook to enforce pausing during transfers
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override
        whenNotPaused
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}