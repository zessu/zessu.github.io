---
title: "Memory, Storage & CallData Storage Locations"
description: "Solidity Storage Locations"
pubDate: "Feb 11 2026"
---

#### **Solidity Data Locations Explained** 🚀

Understanding `storage`, `memory`, and `calldata` is one of those things that feels confusing at first — but once it clicks, it really clicks. This guide breaks it down in a practical way.

---

##### **Quick Reference**

| Location       | Valid For                  | Mutable      | Use Case                                             | Gas Cost |
| -------------- | -------------------------- | ------------ | ---------------------------------------------------- | -------- |
| **`calldata`** | External functions only    | ❌ Read-only | Reading arrays/structs/strings from transaction data | Cheapest |
| **`memory`**   | All functions              | ✅ Yes       | Modifying arrays/structs, temporary computation      | Moderate |
| **`storage`**  | State variables & internal | ✅ Yes       | Modifying state variables directly                   | Variable |

---

<br />

##### 📦 **Storage**

Persistent storage location in smart contracts. Data written here is stored **on-chain**, which makes it expensive compared to other storage options. You need this to store long-term user data, e.g. balances.

---

##### 🧠 **Memory**

Temporary storage location. You use this to store data temporarily — especially data you want to manipulate or work with.This data is stored in memory and cleared once the function exits. Suitable for intermediate calculations. Cheaper than `storage` but more expensive than `calldata`.

---

##### 📥 **CallData**

Another temporary storage location. Unlike memory, it is **immutable and read-only**. Perfect for external function arguments that you do not want to mutate. This makes it cheaper than `memory`, because the data does not need to be copied.

---

#### 🔎 **Value Types vs Reference Types**

Value types (e.g. `uint`, `address`, `bool`) are always passed by value.  
They do **not** need storage locations. These are stored on the stack during execution and passed by copying the value directly to the function. So a `uint256 number` literally holds the number itself — it is copied when passed around.

```solidity
// ✅ Valid - value types don't need locations
function foo(uint256 number) external pure {}
function bar(address user) external pure {}
function baz(bool flag) external pure {}

// ❌ Invalid - compile error!
function invalid(uint256 calldata number) external pure {}
```

<br />

Reference types (e.g. `string`, `bytes`, `arrays`, `structs`, `mappings`) on the other hand are stored in `memory`, `calldata`, or `storage`. Reference types can be dynamic and large, so we do not want to automatically copy them like fixed-size types (e.g. `uint256`). Because of this, we store a reference (pointer) to where the data lives.

```solidity
function foo(string memory s) public {}
function foo(string calldata s) external {}
```

<br />

`s` is not the string itself — it is a pointer to wherever the data is stored during execution.

- **`storage`** → refers to state stored on-chain.
- **`calldata`** → Data provided in transaction input.
- **`memory`** → Copies the provided data into memory so we can work with it.

**`calldata`** is cheaper than `memory` because you leave the data in the transaction input and avoid copying.

#### **Under the Hood** ⚙️

- **`memory`** is linear, expandable EVM memory
- **`calldata`** is a read-only byte array attached to the transaction
- **`storage`** is persistent key-value storage (eventually written to disk by nodes)

<br />

##### 🟢 **Calldata Example**

```typescript
contract CalldataExample {
    // Sum an array without modifying it
    function sumArray(uint256[] calldata arr) external pure returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum;
    }

    // Echo a string back
    function echoMessage(string calldata message)
        external
        pure
        returns (string memory)
    {
        // Cannot modify: message = "new"; ❌ Compile error!
        return message; // copied to memory for return
    }
}
```

<br />

##### 🟡 **Memory Example**

```solidity
contract MemoryExample {
    // Double each element - requires modification
    function doubleArray(uint256[] memory arr)
        external
        pure
        returns (uint256[] memory)
    {
        for (uint256 i = 0; i < arr.length; i++) {
            arr[i] *= 2;  // ✅ Can modify memory
        }
        return arr;
    }

    // Concatenate strings
    function concatenate(string memory a, string memory b)
        external
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(a, b));
    }
}
```

<br />

##### 🔵 **Storage Example**

```solidity
contract StorageExample {
    uint256[] public myArray; // State variable in storage

    // ✅ Valid - internal function can use storage
    function _modifyStorage(uint256[] storage arr) internal {
        arr.push(999);      // Modifies original storage!
        arr[0] = 100;       // Also modifies original
    }

    // ❌ INVALID - external functions cannot use storage parameters
    // function invalid(uint256[] storage arr) external {}

    function addToMyArray() external {
        _modifyStorage(myArray); // Pass reference to storage
    }
}
```

<br />

##### 🟣 **Complete Example**

```solidity
contract CompleteExample {
    uint256[] public stateArray;

    // CALLDATA: Read-only, external, gas efficient
    function readOnly(uint256[] calldata arr)
        external
        pure
        returns (uint256)
    {
        return arr[0];  // Just reading, no copy made
    }

    // MEMORY: Modifiable copy
    function modifyCopy(uint256[] memory arr)
        external
        pure
        returns (uint256[] memory)
    {
        arr[0] = 999;  // Modifies copy only
        return arr;
    }

    // STORAGE: Direct state reference, internal only
    function _modifyState(uint256[] storage arr) internal {
        arr.push(1);   // Modifies original state!
    }

    function addToState() external {
        // Do some checks internally (e.g. validation), then modify state
        _modifyState(stateArray);
    }
}
```

<br />

#### 🏆 **Golden Rule**

>

- Use **`calldata`** when you can.
- Use **`memory`** when you need to modify.
- Use **`storage`** only for internal state modifications.

<br />

#### `References`

- [Understanding Ethereum Storage](https://medium.com/coinmonks/understanding-ethereum-storage-storage-memory-calldata-and-transient-storage-2481bbcf363c)
- [How Storage Works - Base Docs](https://docs.base.org/learn/storage/how-storage-works)
