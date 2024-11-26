// "use server";

// import { getSession, signIn, useSession } from "next-auth/react";
// import { z } from "zod";
// import { promises as fs } from "fs";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";

// const imageSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
//   image: z.instanceof(File),
// });

// export const UploadImage = async (values: z.infer<typeof imageSchema>) => {
//   try {
//     // Validar los valores
//     imageSchema.parse(values);

//     await signIn("credentials", {
//       email: values.email,
//       password: values.password,
//     });

//     const imagePath = path.join(process.cwd(), "uploads", `${uuidv4()}.jpg`);
//     await fs.writeFile(imagePath, await values.image.arrayBuffer());

//     await prisma.image.create({
//       data: {
//         email: values.email,
//         path: imagePath,
//       },
//     });

//     return { success: true };
//   } catch (error) {
//     console.log(error);
//     return { error: "An error occurred" };
//   }
// };
