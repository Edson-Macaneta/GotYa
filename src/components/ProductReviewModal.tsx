import React, { useState, useEffect } from "react";
import {
  X,
  Star,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Flag,
  Loader2,
} from "lucide-react";
import { ProductReview, PartnerProduct } from "../types";

interface ProductReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: PartnerProduct | null;
  currentUserEmail?: string;
  currentUserName?: string;
  onOpenReport?: (url?: string, title?: string) => void;
}

export const ProductReviewModal: React.FC<ProductReviewModalProps> = ({
  isOpen,
  onClose,
  product,
  currentUserEmail = "cliente@gotya.co.mz",
  currentUserName = "Consumidor GotYa",
  onOpenReport,
}) => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState(currentUserName);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      fetch(`/api/products/${product.id}/reviews`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setReviews(data);
          }
        })
        .catch(() => setReviews([]));
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: reviewerName.trim() || currentUserName,
          userEmail: currentUserEmail,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.review) {
        setReviews((prev) => [data.review, ...prev]);
        setComment("");
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch {
      // local push fallback
      const localRev: ProductReview = {
        id: `rev-${Date.now()}`,
        productId: product.id,
        userName: reviewerName || currentUserName,
        userEmail: currentUserEmail,
        rating,
        comment,
        createdAt: "Agora mesmo",
        verifiedPurchase: true,
      };
      setReviews((prev) => [localRev, ...prev]);
      setComment("");
    } finally {
      setLoading(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              AVALIAÇÕES & CONFIANÇA DO CONSUMIDOR
            </span>
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">
              Avaliações de Clientes
            </h3>
          </div>
        </div>

        {/* Product preview */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 mb-6 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <strong className="block text-xs font-bold text-zinc-900 dark:text-white truncate">
              {product.title}
            </strong>
            <span className="text-[11px] text-zinc-500">
              Vendido por: <strong>{product.partnerBusinessName}</strong> ({product.category})
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Star className="w-4 h-4 text-amber-500 fill-current" />
            <span className="text-sm font-bold text-zinc-900 dark:text-white">{avgRating}</span>
            <span className="text-xs text-zinc-400">({reviews.length})</span>
          </div>
        </div>

        {/* Anti-Burla / Scam direct report banner */}
        <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>
              <strong>Suspeita de Burla ou Produto Irregular?</strong> Denuncie imediatamente ao Centro de Segurança.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenReport?.(product.externalLink || product.title, `Burla ou Golpe no Produto: ${product.title}`);
            }}
            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Denunciar Burla</span>
          </button>
        </div>

        {/* New Review Form */}
        <form onSubmit={handleSubmit} className="mb-6 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-3">
          <span className="block text-xs font-bold text-zinc-900 dark:text-white">
            Deixe a sua Avaliação e Comentário:
          </span>

          {/* Star selector */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 cursor-pointer transition-transform hover:scale-110"
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= (hoverRating || rating)
                      ? "text-amber-500 fill-current"
                      : "text-zinc-300 dark:text-zinc-600"
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-semibold text-zinc-500 ml-2">
              {rating} de 5 estrelas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Seu nome"
              className="py-2 px-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100"
            />
            <input
              type="email"
              disabled
              value={currentUserEmail}
              className="py-2 px-3 rounded-xl bg-zinc-200 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500"
            />
          </div>

          <textarea
            rows={3}
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte a sua experiência com este produto ou vendedor (atendimento, entrega, qualidade)..."
            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-hidden focus:border-amber-500"
          />

          <button
            type="submit"
            disabled={loading || !comment.trim()}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>Publicar Avaliação Verificada</span>
          </button>

          {submitted && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center font-semibold">
              Avaliação publicada com sucesso! Obrigado pelo seu contributo à segurança da comunidade.
            </p>
          )}
        </form>

        {/* Existing Reviews List */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
            Comentários Recentes ({reviews.length})
          </h4>

          {reviews.length === 0 ? (
            <p className="text-xs text-zinc-400 py-4 text-center">
              Ainda não há avaliações para este produto. Seja o primeiro a avaliar!
            </p>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/80 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <strong className="text-zinc-900 dark:text-white font-bold">
                        {rev.userName}
                      </strong>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Compra Verificada
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>

                  <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {rev.comment}
                  </p>

                  <span className="text-[10px] text-zinc-400 block">
                    {rev.createdAt}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
