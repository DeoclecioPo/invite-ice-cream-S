const noThanksButton = document.querySelector("#no-thanks");

const carousel = document.querySelector("#ice-cream-carousel");

if (carousel) {
	const slides = [...carousel.querySelectorAll(".carousel-slide")];
	const dots = [...carousel.querySelectorAll(".carousel-dot")];
	let activeSlide = 0;

	const showSlide = (nextSlide) => {
		activeSlide = (nextSlide + slides.length) % slides.length;
		slides.forEach((slide, index) => {
			const isActive = index === activeSlide;
			slide.classList.toggle("is-active", isActive);
			slide.setAttribute("aria-hidden", String(!isActive));
			dots[index].classList.toggle("is-active", isActive);
			dots[index].setAttribute("aria-pressed", String(isActive));
		});
	};

	carousel.querySelector(".carousel-prev").addEventListener("click", () => showSlide(activeSlide - 1));
	carousel.querySelector(".carousel-next").addEventListener("click", () => showSlide(activeSlide + 1));
	dots.forEach((dot, index) => dot.addEventListener("click", () => showSlide(index)));
}

if (noThanksButton) {
	noThanksButton.addEventListener("click", () => {
		document.querySelector("#no-response").hidden = false;
		noThanksButton.textContent = "Tudo bem ♡";
		noThanksButton.disabled = true;
	});
}

const dateForm = document.querySelector("#date-form");

if (dateForm) {
	const dateInput = document.querySelector("#meet-date");
	const today = new Date();
	dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
		.toISOString()
		.slice(0, 10);

	dateForm.addEventListener("submit", async (event) => {
		event.preventDefault();
		const submitButton = dateForm.querySelector("[type='submit']");
		submitButton.disabled = true;
		submitButton.textContent = "Preparando o convite…";

		const chosenDate = new Date(`${dateInput.value}T12:00:00`).toLocaleDateString("pt-BR", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
		});
		const chosenTime = dateForm.querySelector("input[name='meet-time']:checked").value;
		const message = `Oi! Aqui estão minhas ideias para o nosso sorvete 🍦\n\nData: ${chosenDate}\nHorário: ${chosenTime}\n\n♡`;

		try {
			if (!window.jspdf?.jsPDF) throw new Error("PDF indisponível");

			const pdf = new window.jspdf.jsPDF();
			pdf.setFillColor(255, 246, 243);
			pdf.rect(0, 0, 210, 297, "F");
			pdf.setTextColor(190, 91, 118);
			pdf.setFont("helvetica", "bold");
			pdf.setFontSize(24);
			pdf.text("Nosso sorvetinho", 22, 38);
			pdf.setDrawColor(240, 190, 198);
			pdf.setLineWidth(0.6);
			pdf.line(22, 47, 188, 47);
			pdf.setTextColor(72, 71, 76);
			pdf.setFont("helvetica", "normal");
			pdf.setFontSize(14);
			pdf.text("Oi! Aqui estão minhas ideias para o nosso encontro:", 22, 68);
			pdf.setFont("helvetica", "bold");
			pdf.text("Data", 22, 96);
			pdf.setFont("helvetica", "normal");
			pdf.text(pdf.splitTextToSize(chosenDate, 160), 22, 106);
			pdf.setFont("helvetica", "bold");
			pdf.text("Horário", 22, 132);
			pdf.setFont("helvetica", "normal");
			pdf.text(chosenTime, 22, 142);
			pdf.setTextColor(190, 91, 118);
			pdf.setFontSize(12);
			pdf.text("Com carinho, Sophia  ♡", 22, 178);
			pdf.setFontSize(10);
			pdf.text("Um convite para adoçar o dia.", 22, 265);

			const pdfBlob = pdf.output("blob");
			const pdfFile = new File([pdfBlob], "nosso-sorvetinho.pdf", { type: "application/pdf" });

			if (navigator.canShare?.({ files: [pdfFile] }) && navigator.share) {
				await navigator.share({ title: "Nosso sorvetinho", text: message, files: [pdfFile] });
			} else {
				pdf.save("nosso-sorvetinho.pdf");
				window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener");
				document.querySelector("#share-status").textContent = "O PDF foi baixado. No WhatsApp, escolha a conversa e anexe o arquivo nosso-sorvetinho.pdf.";
			}
		} catch (error) {
			if (error.name === "AbortError") return;
			document.querySelector("#share-status").textContent = "Não consegui preparar o PDF agora. Confira sua conexão e tente novamente.";
		} finally {
			submitButton.disabled = false;
			submitButton.textContent = "Compartilhar meu convite";
		}
	});
}
