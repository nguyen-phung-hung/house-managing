import { supabase } from "../../../utils/supabase";
import cookie from "cookie";

export default async function handler(req, res) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }

  const token = cookie.parse(req.headers.cookie)["sb:token"];
  supabase.auth.session = () => ({
    access_token: token,
  });

  const { friendID, id } = req.body;

  if (!friendID) {
    return res.status(400).send({
      message: "Missing input",
    });
  }

  if (friendID === user.id) {
    return res.status(400).send({
      message: "You can't accept yourself or interal error",
    });
  }

  const { error } = await supabase.from("friends").insert({
    userID: user.id,
    friendID: friendID,
  });

  if (error) {
    return res.status(500).send({
      message: "Internal server error",
    });
  }

  const { error: error1 } = await supabase.from("friends").insert({
    userID: friendID,
    friendID: user.id,
  });

  if (error1) {
    return res.status(500).send({
      message: "Internal server error",
    });
  }

  const { error: error2 } = await supabase
    .from("friendRequest")
    .delete()
    .eq("id", id);

  if (error2) {
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }

  return res.status(200).send({
    message: "Success",
  });
}
