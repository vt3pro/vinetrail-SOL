use solana_sdk::message::Message;
use solana_sdk::pubkey::Pubkey;
use solana_sdk::signature::{Keypair, Signer};
use solana_system_interface::instruction as system_instruction;
use solana_sdk::transaction::{Transaction, VersionedTransaction};
use vinetrail_solana_inspector::{
    pre_broadcast_check, probe_transaction, probe_versioned_tx, AgentSoilHints, ProbeError,
};

#[test]
fn probe_legacy_system_transfer() {
    let payer = Keypair::new();
    let to = Pubkey::new_unique();
    let ix = system_instruction::transfer(&payer.pubkey(), &to, 1_000);
    let message = Message::new(&[ix], Some(&payer.pubkey()));
    let tx = Transaction::new(&[&payer], message, solana_sdk::hash::Hash::default());
    let vtx = VersionedTransaction::from(tx);
    let probe = probe_transaction(&vtx).expect("probe");
    assert_eq!(probe.ix_count, 1);
    assert!(!probe.unknown_program);

    let bytes = bincode::serialize(&vtx).expect("serialize");
    let wire = probe_versioned_tx(&bytes).expect("wire");
    assert_eq!(wire.ix_count, probe.ix_count);
}

#[test]
fn empty_message_errors() {
    let payer = Keypair::new();
    let message = Message::new(&[], Some(&payer.pubkey()));
    let tx = Transaction::new(&[&payer], message, solana_sdk::hash::Hash::default());
    let vtx = VersionedTransaction::from(tx);
    assert_eq!(probe_transaction(&vtx), Err(ProbeError::EmptyInstructions));
}

#[test]
fn pre_broadcast_allows_healthy_hints() {
    let payer = Keypair::new();
    let to = Pubkey::new_unique();
    let ix = system_instruction::transfer(&payer.pubkey(), &to, 1_000);
    let message = Message::new(&[ix], Some(&payer.pubkey()));
    let tx = Transaction::new(&[&payer], message, solana_sdk::hash::Hash::default());
    let vtx = VersionedTransaction::from(tx);
    let probe = probe_transaction(&vtx).unwrap();
    let hints = AgentSoilHints {
        pyth_price_usd: 150.0,
        jupiter_depth_usd: 500_000.0,
        orca_depth_usd: 500_000.0,
        order_size_usd: 500.0,
        account_balance_usd: 10_000.0,
        max_slippage: 0.05,
        min_depth_usd: 100_000.0,
        daily_notional_usd: 0.0,
        extra_protocol_mask: 0.0,
    };
    let v = pre_broadcast_check(&probe, &hints);
    assert!(v.allowed);
}
