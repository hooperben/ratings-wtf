import { Card, CardContent } from "@/components/ui/card";

export interface URLPreviewProps {
  description: string;
  favicon: string;
  image: string;
  images: string[];
  site_name: string;
  title: string;
  type: string;
  url: string;
}

const URLPreview = ({ htmlInferred }: { htmlInferred: URLPreviewProps }) => {
  const { description, image, images, site_name, url } = htmlInferred;

  return (
    <Card>
      <CardContent>
        <div className="flex gap-2 mt-4">
          <img
            src={image && images.length < 1 ? image : images[0]}
            alt={`returned image`}
            className="w-12 h-12"
          />

          <div className="flex flex-col">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-blue-500 dark:text-blue-400"
            >
              {site_name}
            </a>
            <p>{description}</p>
          </div>
        </div>

        {images.length > 0 && (
          <div className="flex mt-4 justify-center">
            {images.length > 1 && (
              <>
                <div className="flex gap-4">
                  {images.slice(1).map((imgSrc, index) => (
                    <img
                      key={index + 1}
                      src={imgSrc}
                      alt={`Preview image ${index + 2}`}
                      className="w-52 h-52 rounded-lg object-cover"
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default URLPreview;
