# Adding a new Maker

1. Copy example maker files to new directory for your company

   ```console
   cp -a src/makers/__example__/. src/makers/yourMakerName
   ```

2. Update or replace the hotspot icon in your directory (you may have multiple)
   `src/makers/yourMakerName/hotspot.svg`

3. Update the contents of these files in this order

   1. `src/makers/{makerName}/antennas.ts`
   2. `src/makers/{makerName}/hotspots.ts`
   3. `src/makers/{makerName}/index.ts`

4. Update `src/makers/index.ts`
   1. Import your maker
      ```
      import yourMakerName from './yourMakerName'
      ```
   2. Add your maker to the main Makers object
      ```
      export const Makers: Record<string, { id: number; supportEmail: string }> = {
        makerA,
        makerB,
        theRest,
        yourMakerName,
      }
      ```
   3. Add your antennas
      ```
      export const AntennaModels = {
        ...makerA.antennas,
        ...makerB.antennas,
        ...theRest.antennas,
        ...yourMakerName.antennas,
      }
      ```
   4. Add your models
      ```
      export const HotspotMakerModels = {
        ...makerA.hotspots,
        ...makerB.hotspots,
        ...theRest.hotspots,
        ...yourMakerName.hotspots,
      }
      ```
