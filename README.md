# Lykan Hypersport Assembly Experience

An interactive 3D factory reveal experience featuring the Lykan Hypersport hypercar, built with Three.js and WebGL.

## ✨ Features

- **Real 3D Model** - High-quality Lykan Hypersport GLB model from Sketchfab
- **9-Stage Assembly Sequence** - Progressive build visualization
- **Interactive Controls** - Scroll, drag, and zoom interactions
- **Cinematic Effects** - Professional lighting, animations, and visual feedback
- **Responsive Design** - Works on desktop and modern browsers
- **Performance Optimized** - Smooth 60 FPS rendering

## 🎯 9-Stage Assembly

1. **Carbon Fiber Monocoque Chassis** - Foundation engineering
2. **Engine Block & Powertrain** - Quad-turbo performance
3. **Suspension & Wheels** - Adaptive air suspension setup
4. **Interior Cabin** - Luxury cockpit build
5. **Body Panels** - Aerodynamic carbon fiber panels
6. **Doors & Access Points** - Gullwing door assembly
7. **Lighting Systems** - LED matrix integration
8. **Paint & Final Finish** - Surface treatment
9. **Complete Hypercar Reveal** - Final masterpiece

## 🎮 Controls

- **Scroll** - Advance through assembly stages
- **Drag Mouse** - Rotate the 3D model
- **Mouse Wheel** - Zoom in/out
- **Info Panel** - Real-time progress tracking

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/alisherifrashed2006-debug/hypercar-assembly.git
cd hypercar-assembly

# Run a local server (required for CORS)
python -m http.server 8000
# OR
npx http-server
```

Open `http://localhost:8000` in your browser

## 📦 Project Structure

```
hypercar-assembly/
├── index.html          # Main HTML with UI
├── assembly.js         # Three.js logic & animations
├── README.md          # Documentation
└── models/            # 3D model storage directory
```

## 🎨 Technology Stack

- **Three.js** - 3D graphics & WebGL rendering
- **GLTF Loader** - Model loading & parsing
- **HTML5/CSS3** - UI & responsive design
- **Vanilla JavaScript** - Interaction logic

## 📊 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎬 Features in Detail

### Cinematic Lighting
- Key light (blue accent #64b5ff)
- Fill light (magenta accent #ff6b9d)
- Back light for depth
- Real-time shadow mapping

### Assembly Effects
- Progressive opacity reveals
- Material color shifts
- Emissive glow animations
- Orbital camera movements
- Scroll-triggered transitions

### Interactive Features
- Smooth model rotation
- Zoom sensitivity control
- Stage progress tracking
- Real-time scroll metrics
- Responsive to viewport changes

## 🎯 Model Credits

**Lykan Hypersport GLB** - Creative Commons Attribution License
- **Source:** Sketchfab
- **Model:** [LYKAN HYPERSPORT Glb Rigged](https://sketchfab.com/3d-models/lykan-hypersport-glb-rigged-7b8c9b92b672413ea1213557f334416c)
- **License:** CC Attribution 4.0

## 🔧 Customization

### Change the Model

Edit the `modelUrls` array in `assembly.js`:

```javascript
const modelUrls = [
    'your-model-url.glb',
    'fallback-model.glb'
];
```

### Adjust Colors

Edit CSS in `index.html`:
- Primary blue: `#64b5ff`
- Accent magenta: `#ff6b9d`
- Background: `#0a0e27`

### Modify Camera Behavior

Edit `animateCamera()` function:

```javascript
const distance = 5 + progress * 3;  // Orbital distance
const zoomSpeed = 0.1;              // Zoom sensitivity
```

## 🚨 Troubleshooting

### Model not loading
- Check browser console for errors
- Ensure CORS headers are correct
- The app falls back to procedural car generation

### Low performance
- Close background applications
- Try a different browser (Chrome recommended)
- Reduce shadow map resolution in code

### Lights look wrong
- Check light positions in `setupLighting()`
- Adjust intensity values
- Verify material properties

## 📄 License

This project uses the Lykan Hypersport model under Creative Commons Attribution License.
See model credits above.

## 🤝 Contributing

Feel free to fork and create pull requests for improvements.

---

**Enjoy your factory reveal! 🏎️✨**
