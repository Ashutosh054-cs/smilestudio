"use client";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase, handleSupabaseError } from "../services/supabaseClient";
import { ArrowLeft, Video as VideoIcon } from "lucide-react";

export default function VideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setError("");
        setLoading(true);
        const { data, error } = await supabase
          .from("gallery_videos")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        setVideo(data);
      } catch (err) {
        setError(handleSupabaseError(err, "fetching video"));
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

  return (
    <section className="mt-32 px-4 md:px-6 lg:px-8 max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-pink-600 mb-4"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {video?.video_url ? (
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <video
              src={video.video_url}
              controls
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="p-10 text-center">
            <VideoIcon size={48} className="mx-auto mb-4" />
            No video available
          </div>
        )}
        <div className="p-4">
          <h1 className="text-xl font-bold">{video?.title}</h1>
          <p className="text-gray-500 capitalize">Category: {video?.category}</p>
        </div>
      </div>
    </section>
  );
}
