import { Photograph } from "@/shared/api";
import { GlobalThis } from "@/shared/reearthTypes";

const layerDataIds: string[] = [];
const reearth = (globalThis as unknown as GlobalThis).reearth;

export const addLayersByData = (data: Photograph[] | undefined) => {
  if (!data) return;

  // find the new ones that are not in layerDataIds
  const dataIds = data.map((item) => item.id);
  const newDataIds = dataIds.filter((id) => !layerDataIds.includes(id));

  if (newDataIds.length === 0) return;

  // add new layer for each new data
  newDataIds.forEach((id) => {
    const item = data.find((d) => d.id === id);
    if (!item) return;

    reearth.layers.add({
      type: "simple",
      data: {
        type: "geojson",
        value: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                title: item.title,
                description: item.description,
                photoUrl: item.photoUrl,
                author: item.author,
                createdAt: item.createdAt,
              },
              geometry: {
                coordinates: item.position?.coordinates,
                type: "Point",
              },
            },
          ],
        },
      },
      marker: {
        style: "image",
        image: item.photoUrl,
      },
      infobox: {
        blocks: [
          {
            // id: "image-block",
            pluginId: "reearth",
            extensionId: "imageInfoboxBetaBlock",
            // extensionType: "infoboxBlock",
            property: {
              default: {
                src: {
                  value: "${photoUrl}",
                },
              },
            },
          },
          {
            // id: "property-block",
            pluginId: "reearth",
            extensionId: "propertyInfoboxBetaBlock",
            // extensionType: "infoboxBlock",
            property: {
              default: {
                displayType: {
                  value: "custom",
                },
                propertyList: {
                  value: [
                    {
                      id: "title",
                      key: "Title",
                      value: "${title}",
                    },
                    {
                      id: "description",
                      key: "Description",
                      value: "${description}",
                    },
                    {
                      id: "author",
                      key: "Author",
                      value: "${author}",
                    },
                    {
                      id: "date",
                      key: "Date",
                      value: "${createdAt}",
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    });

    layerDataIds.push(id);
  });
};
