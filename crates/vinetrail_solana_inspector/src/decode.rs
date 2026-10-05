pub const MAX_IX: usize = 32;

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum ProbeError {
    Deserialize,
    EmptyInstructions,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct SolanaTxProbe {
    pub ix_count: u8,
    pub account_keys_len: u8,
    pub total_data_len: u32,
    pub writable_signer_count: u8,
    pub unknown_program: bool,
    pub ix_program_class: [u8; MAX_IX],
}

impl SolanaTxProbe {
    pub fn empty() -> Self {
        Self {
            ix_count: 0,
            account_keys_len: 0,
            total_data_len: 0,
            writable_signer_count: 0,
            unknown_program: false,
            ix_program_class: [0u8; MAX_IX],
        }
    }
}

pub fn probe_versioned_tx(bytes: &[u8]) -> Result<SolanaTxProbe, ProbeError> {
    crate::wire::probe_versioned_bytes(bytes)
}

pub fn probe_transaction(tx: &solana_sdk::transaction::VersionedTransaction) -> Result<SolanaTxProbe, ProbeError> {
    crate::wire::stack_probe(tx)
}
