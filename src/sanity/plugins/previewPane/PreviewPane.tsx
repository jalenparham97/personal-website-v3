import { Card, Text } from "@sanity/ui";
import { memo, Suspense, type ComponentProps } from "react";
import { useClient } from "sanity";
import { type UserViewComponent } from "sanity/structure";
import { suspend } from "suspend-react";

import { getSecret } from "@/sanity/plugins/productionUrl/utils";
import { resolveHref } from "@/sanity/sanity.links";

/**
 * This component is responsible for rendering a preview of a post inside the Studio.
 */

export type PreviewProps = ComponentProps<UserViewComponent>;
interface IframeProps {
  apiVersion: string;
  documentType?: string;
  previewSecretId: `${string}.${string}`;
  slug?: string;
}

export function PreviewPane(
  props: PreviewProps & {
    previewSecretId: `${string}.${string}`;
    apiVersion: string;
  },
) {
  const { document, previewSecretId, apiVersion } = props;
  const { displayed } = document;
  const documentType = displayed?._type;
  const slug = (displayed?.slug as { current?: string })?.current;

  const href = resolveHref(documentType, displayed?.slug as string);

  if (!href) {
    return (
      <Card tone="primary" margin={5} padding={6}>
        <Text align="center">
          Please add a slug to the post to see the preview!
        </Text>
      </Card>
    );
  }

  return (
    <Card
      scheme="light"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <Suspense fallback={null}>
        <Iframe
          apiVersion={apiVersion}
          documentType={documentType}
          previewSecretId={previewSecretId}
          slug={slug}
        />
      </Suspense>
    </Card>
  );
}

// Used as a cache key that doesn't risk collision or getting affected by other components that might be using `suspend-react`
const fetchSecret = Symbol("preview.secret");
const Iframe = memo(function Iframe(props: IframeProps) {
  const { apiVersion, documentType, previewSecretId, slug } = props;
  const client = useClient({ apiVersion });

  const secret = suspend(
    () => getSecret(client, previewSecretId, true),
    ["getSecret", previewSecretId, fetchSecret],
    // The secret fetch has a TTL of 1 minute, just to check if it's necessary to recreate the secret which has a TTL of 60 minutes
    { lifespan: 60000 },
  );

  const url = new URL("/api/preview", location.origin);
  if (documentType) {
    url.searchParams.set("documentType", documentType);
  }
  if (slug) {
    url.searchParams.set("slug", slug);
  }
  if (secret) {
    url.searchParams.set("secret", secret);
  }

  return (
    <iframe
      style={{ width: "100%", height: "100%", position: "relative", zIndex: 1 }}
      src={url.toString()}
    />
  );
});
