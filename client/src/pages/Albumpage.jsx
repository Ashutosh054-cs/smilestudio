"use client";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase, handleSupabaseError } from "../services/supabaseClient";
import { ArrowLeft, FileText } from "lucide-react";

export default function AlbumPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setError("");
        setLoading(true);
        const { data, error } = await supabase
          .from("gallery_albums")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        setAlbum(data);
      } catch (err) {
        setError(handleSupabaseError(err, "fetching album"));
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

  return (
    <section className="mt-32 px-0 md:px-4 lg:px-6 max-w-full">
      <div className="max-w-6xl mx-auto px-4 md:px-0">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-pink-600 mb-4"
        >
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden max-w-6xl mx-auto">
        {album?.album_url ? (
          <iframe
            src={album.album_url}
            title={album.title}
            className="w-full"
            style={{
              height: "calc(100vh - 100px)", // full height minus navbar
              border: "none",
            }}
          />
        ) : (
          <div className="p-10 text-center">
            <FileText size={48} className="mx-auto mb-4 text-red-600" />
            No album available
          </div>
        )}
        <div className="p-4">
          <h1 className="text-xl font-bold">{album?.title}</h1>
          <p className="text-gray-500 capitalize">Category: {album?.category}</p>
          {album?.page_count && (
            <p className="text-gray-500">Pages: {album.page_count}</p>
          )}
        </div>
      </div>
    </section>
  );
}
