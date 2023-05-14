import prisma from '../../../../lib/prisma';
import { APIResponse } from '/types';


import type { NextApiRequest, NextApiResponse } from 'next';
export async function getSiteBySubdomain(subdomain: string) {
  const site = await prisma.site.findFirst({
    where: {
      OR: [{ subdomain }],
    },
    include: {
      user: true
    }
  });

  if (!site) {
    throw new Error("No site found")
  }

  // https://stackoverflow.com/questions/72176573/object-object-object-cannot-be-serialized-as-json-please-only-return-js
  const serializedSite = JSON.parse(JSON.stringify(site));

  return serializedSite;
}


// /api/sites/[subdomain]
const Site = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { subdomain },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const site = await getSiteBySubdomain(subdomain as string);

        const serializedSite = JSON.parse(JSON.stringify(site));
        // TODO: apply this kind of (no data) responses for the rest of the endpoints
        const response: APIResponse = serializedSite
        return res.status(200).json(
          response
        );
      } catch (error) {
        console.log(error)
        return res.status(404).json({
          error: true,
        });
      }
    default:
      return res
        .status(405)
        .json({ error: true, data: { message: "Method not allowed" } })
  }
}

export default Site;
