//! Solana pre-broadcast inspector — decode tx metadata, route into `vinetrail_core`.

mod decode;
mod route;
mod wire;

pub use decode::{probe_transaction, probe_versioned_tx, ProbeError, SolanaTxProbe, MAX_IX};
pub use route::{pre_broadcast_check, AgentSoilHints, PreBroadcastVerdict};
