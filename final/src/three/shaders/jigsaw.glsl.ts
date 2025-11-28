export const jigsawFunctions = `
// IQ's vec2 to float hash
float h21(vec2 p){ return fract(sin(dot(p, vec2(27.3, 57.7)))*1e4); }

// A basic diamond shape
float di(vec2 p){ p = abs(p); return (p.x + p.y - 1.)*.7 + .05; }

// The jigsaw pattern algorithm
// Returns: vec3(pieceID.x, pieceID.y, distanceToEdge)
vec3 jigsaw(vec2 p){
    // Local cell ID and coordinates.
    vec2 ip = floor(p); p -= ip + .5; 
 
    // Directional helper vectors.
    vec2 m = fract(ip/2.)*2. - .5; // Orientation vector.   
    vec2 dirV = dot(m, p)<0.? -m : m; // Direction vector.
    vec2 rD = (h21(ip) - .5)*dirV; // Random vector.
    
    // The distance functions -- A diamond, and offset nodule.
    float d = di(p - dirV), c = length(p - dirV*.2) - .2;
    
    // Add the nodules to a random side of the diagonal.
    if(rD.x<0.){  
        d = max(d, .1 - c);
        if(c<d) ip -= dirV*2.;
    }  
     
    // Return vec3(ID.x, ID.y, distance) to match existing shader logic
    return vec3(ip + dirV, min(d, c));    
}
`;
