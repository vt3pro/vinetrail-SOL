//! Soil lane extraction — array-first layout from Wasm input slab.

use crate::eval::SOIL_INPUT_FLOATS;

#[derive(Clone, Copy, Debug)]
pub struct VenueMids {
    pub spot: f64,
    pub perp_a: f64,
    pub perp_b: f64,
}

#[derive(Clone, Copy, Debug)]
pub struct SoilScalars {
    pub order_size: f64,
    pub account: f64,
    pub max_slip: f64,
    pub min_depth: f64,
    pub depth_usd: f64,
}

#[inline]
pub fn load_venue_mids(input: &[f64; SOIL_INPUT_FLOATS], soil_in: usize) -> VenueMids {
    VenueMids {
        spot: input[soil_in],
        perp_a: input[soil_in + 1],
        perp_b: input[soil_in + 2],
    }
}

#[inline]
pub fn load_soil_scalars(input: &[f64; SOIL_INPUT_FLOATS], soil_in: usize) -> SoilScalars {
    SoilScalars {
        depth_usd: input[soil_in + 3],
        order_size: input[soil_in + 4],
        account: input[soil_in + 5],
        max_slip: input[soil_in + 6],
        min_depth: input[soil_in + 7],
    }
}
