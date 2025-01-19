import React, { useRef, useEffect, useState } from "react";
import KeenSlider from "keen-slider";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { axiosInstance } from "../../lib/axios.js"; // Adjust the path based on your setup
import toast from "react-hot-toast";

const TestimonialsSlider = () => {
  const sliderRef = useRef(null);
  const [slider, setSlider] = useState(null);
  const [activeSlide, setActiveSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(0);
  const [testimonials, setTestimonials] = useState([]);

  // Fetch testimonials from the API
  const fetchTestimonials = async () => {
    try {
      const response = await axiosInstance.get("/testimonials");
      setTestimonials(response.data); // Assuming the API returns an array of testimonials
    } catch (error) {
      toast.error("Failed to load testimonials.");
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!sliderRef.current || testimonials.length === 0) return;

    const keenSliderInstance = new KeenSlider(sliderRef.current, {
      loop: true,
      defaultAnimation: { duration: 750 },
      slides: {
        origin: "center",
        perView: 1,
        spacing: 16,
      },
      breakpoints: {
        "(min-width: 640px)": {
          slides: { origin: "center", perView: 1.5, spacing: 16 },
        },
        "(min-width: 768px)": {
          slides: { origin: "center", perView: 1.75, spacing: 16 },
        },
        "(min-width: 1024px)": {
          slides: { origin: "center", perView: 3, spacing: 16 },
        },
      },
      created(slider) {
        setTotalSlides(slider.slides.length);
        setActiveSlide(slider.track.details.rel + 1);
        slider.slides[slider.track.details.rel].classList.remove("opacity-40");
      },
      slideChanged(slider) {
        setActiveSlide(slider.track.details.rel + 1);
        slider.slides.forEach((slide) => slide.classList.add("opacity-40"));
        slider.slides[slider.track.details.rel].classList.remove("opacity-40");
      },
    });

    setSlider(keenSliderInstance);

    return () => keenSliderInstance.destroy();
  }, [testimonials]);

  return (
    <section className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-screen-xl">
        <h2 className="mb-3 text-3xl text-center font-bold leading-[1.208] text-dark dark:text-white sm:text-4xl md:text-[40px]">
          Testimonials
        </h2>

        <div className="mt-8">
          <div ref={sliderRef} className="keen-slider">
            {testimonials.map((testimonial, idx) => (
              <div
                key={testimonial._id || idx}
                className="keen-slider__slide opacity-40 transition-opacity duration-500"
              >
                <blockquote className="rounded-lg bg-gray-50 p-6 shadow-sm sm:p-8">
                  <div className="flex items-center gap-4">
                    <img
                      alt={testimonial.userName}
                      src={testimonial.userImage || `https://placehold.jp/3d4070/ffffff/150x150.png?text=${testimonial.userName.split(" ")[0][0]}${testimonial.userName.split(" ")[1][0]}`}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex gap-0.5 text-purple-500">
                        {Array(testimonial.stars)
                          .fill(0)
                          .map((_, starIdx) => (
                            <svg
                              key={starIdx}
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                      </div>
                      <p className="mt-0.5 text-lg font-medium text-gray-900">{testimonial.userName}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700">{testimonial.opinion}</p>
                </blockquote>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center mt-4">
            <button
              className="px-4 py-2 mx-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => slider?.prev()}
            >
              <ChevronLeft />
            </button>
            <p className="text-gray-500">
              {activeSlide} / {totalSlides}
            </p>
            <button
              className="px-4 py-2 mx-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => slider?.next()}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
