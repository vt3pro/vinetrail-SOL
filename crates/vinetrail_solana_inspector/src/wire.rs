//! Stack-only probe summary — one bincode decode, no `Vec` in `SolanaTxProbe`.

use solana_sdk::message::VersionedMessage;
use solana_sdk::pubkey::Pubkey;
use solana_sdk::transaction::VersionedTransaction;

use crate::decode::{ProbeError, SolanaTxProbe, MAX_IX};

const SYSTEM_PROGRAM: Pubkey = solana_sdk::system_program::id();
const TOKEN_PROGRAM: Pubkey = solana_sdk::pubkey!("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

#[inline]
fn program_class(pid: &Pubkey) -> u8 {
    if *pid == SYSTEM_PROGRAM {
        0
    } else if *pid == TOKEN_PROGRAM {
        1
    } else {
        2
    }
}

pub fn probe_versioned_bytes(bytes: &[u8]) -> Result<SolanaTxProbe, ProbeError> {
    let tx: VersionedTransaction = bincode::deserialize(bytes).map_err(|_| ProbeError::Deserialize)?;
    stack_probe(&tx)
}

pub fn stack_probe(tx: &VersionedTransaction) -> Result<SolanaTxProbe, ProbeError> {
    let message = &tx.message;
    let account_keys = message.static_account_keys();
    let header = match &message {
        VersionedMessage::Legacy(m) => m.header,
        VersionedMessage::V0(m) => m.header,
    };
    let ixs = message.instructions();
    if ixs.is_empty() {
        return Err(ProbeError::EmptyInstructions);
    }
    if ixs.len() > MAX_IX || account_keys.len() > 64 {
        return Err(ProbeError::Deserialize);
    }

    let mut probe = SolanaTxProbe::empty();
    probe.ix_count = ixs.len() as u8;
    probe.account_keys_len = account_keys.len() as u8;
    probe.writable_signer_count = header.num_required_signatures;

    for (i, ix) in ixs.iter().enumerate() {
        probe.total_data_len += ix.data.len() as u32;
        let pid = account_keys
            .get(ix.program_id_index as usize)
            .copied()
            .unwrap_or_default();
        let class = program_class(&pid);
        probe.ix_program_class[i] = class;
        if class == 2 {
            probe.unknown_program = true;
        }
    }
    Ok(probe)
}
