import prisma from '../../../../lib/prisma';

import type { NextApiRequest, NextApiResponse } from "next";
async function getSites() {
  const sites = await prisma.site.findMany({ include: { user: true } });

  const serializedSites = JSON.parse(JSON.stringify(sites));

  return serializedSites;
}

const Sites = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const users = await getSites();

        return res.status(200).json({
          error: false,
          data: users,
        });
      } catch (error) {
        return res.status(404).json({
          error: true,
        });
      }
    case "POST":

      try {
        await prisma.site.create({
          data: req.body
        });

        return res.status(200).json({ done: "ok" });
      } catch (error) {
        console.log(error)
        return res.status(500).json({ error: true, data: { message: "Method not allowed" } })
      }
    default:
      return res
        .status(405)
        .json({ error: true, data: { message: "Method not allowed" } })
  }
}

export default Sites;

