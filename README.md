# @react-three/xr

```tsx
import { createXR } from "@react-three/xr"

const { enterAR, XR } = createXR()

function App() {
    return <>
        <button onClick={enterAR}>EnterAR</button>
        <Canvas>
            <XR>
                <Box />
            </XR>
        </Canvas>
    </>
}
```
