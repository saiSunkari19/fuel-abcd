contract;

use std::execution::run_external;
use standards::src14::{SRC14, SRC14_TARGET_STORAGE, SRC14Extension};
use standards::src5::{AccessError, State};

/// The owner of this contract at deployment.
#[allow(dead_code)]
const INITIAL_OWNER: Identity = Identity::Address(Address::zero());

storage {
    counter: u64 = 0,
    SRC14 {
        target in 0x7bb458adc1d118713319a5baa00a2d049dd64d2916477d2688d76970c898cd55: ContractId = ContractId::zero(),
        owner: State = State::Initialized(INITIAL_OWNER),
    },
}

abi Counter {
    #[storage(read, write)]
    fn increment(amount: u64) -> u64;

    #[storage(read)]
    fn counter() -> u64;
}

impl SRC14 for Contract {
    #[storage(read, write)]
    fn set_proxy_target(new_target: ContractId) {
        only_owner();
        storage::SRC14.target.write(new_target);
    }

    #[storage(read)]
    fn proxy_target() -> Option<ContractId> {
        storage::SRC14.target.try_read()
    }
}

impl SRC14Extension for Contract {
    #[storage(read)]
    fn proxy_owner() -> State {
        storage::SRC14.owner.read()
    }
}

#[fallback]
#[storage(read)]
fn fallback() {
    run_external(storage::SRC14.target.read())
}

#[storage(read)]
fn only_owner() {
    require(
        storage::SRC14
            .owner
            .read() == State::Initialized(msg_sender().unwrap()),
        AccessError::NotOwner,
    );
}

impl Counter for Contract {
    #[storage(read)]
    fn counter() -> u64 {
        storage.counter.read()
    }

    #[storage(read, write)]
    fn increment(amount: u64) -> u64 {
        let incremented = storage.counter.read() + amount;
        storage.counter.write(incremented);
        incremented
    }
}
