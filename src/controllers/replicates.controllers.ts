import { Request, Response } from "express";
import { replicate } from "../configs/replicate.config";

export const speechToTextHandler = async (req: Request, res: Response) => {
  try {
    const [vocal] = [req.body.vocal];
    console.log(vocal);
    const output: any = await replicate.run(
      "openai/whisper:4d50797290df275329f202e48c76360b3f22b08d28c196cbc54600319435f8d2",
      {
        input: {
          audio: vocal,
          model: "large-v3",
          translate: false,
          temperature: 0,
          transcription: "plain text",
          suppress_tokens: "-1",
          logprob_threshold: -1,
          no_speech_threshold: 0.6,
          condition_on_previous_text: true,
          compression_ratio_threshold: 2.4,
          temperature_increment_on_fallback: 0.2,
        },
      }
    );
    console.log(output);
    return res.status(200).json({ transcription: output.transcription });
  } catch (error) {
    return res.status(500).json({
      message: "error",
    });
  }
};
