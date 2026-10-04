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
	const response = document.querySelector("#no-response");
	const messages = [
		"Por que não?",
		"Tem certeza?",
		"Só dessa vez?",
		"Vai, por favor",
		"Prometo que vai ser legal",
		"Por favorzinho?",
		"Me dá uma chance",
		"Não custa tentar",
	];
	let messageIndex = 0;
	let lastMoveAt = 0;

	const moveButton = (event) => {
		const padding = 8;
		const maxLeft = Math.max(padding, window.innerWidth - noThanksButton.offsetWidth - padding);
		const maxTop = Math.max(padding, window.innerHeight - noThanksButton.offsetHeight - padding);
		let left = padding + Math.random() * (maxLeft - padding);
		let top = padding + Math.random() * (maxTop - padding);

		for (let attempt = 0; attempt < 20; attempt += 1) {
			left = padding + Math.random() * (maxLeft - padding);
			top = padding + Math.random() * (maxTop - padding);
			const pointerX = event.clientX;
			const pointerY = event.clientY;
			if (Math.hypot(left + noThanksButton.offsetWidth / 2 - pointerX, top + noThanksButton.offsetHeight / 2 - pointerY) > 120) break;
		}

		noThanksButton.classList.add("is-dodging");
		noThanksButton.style.left = `${left}px`;
		noThanksButton.style.top = `${top}px`;
		response.textContent = messages[messageIndex];
		response.hidden = false;
		messageIndex = (messageIndex + 1) % messages.length;
		lastMoveAt = Date.now();
	};

	noThanksButton.addEventListener("pointerenter", (event) => {
		if (event.pointerType !== "touch") moveButton(event);
	});
	noThanksButton.addEventListener("pointerdown", (event) => {
		event.preventDefault();
		moveButton(event);
	});
	noThanksButton.addEventListener("click", (event) => {
		event.preventDefault();
		if (Date.now() - lastMoveAt > 500) moveButton(event);
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
		document.querySelector("#celebration").hidden = false;
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
			pdf.setFillColor(255, 255, 255);
			pdf.roundedRect(12, 12, 186, 273, 5, 5, "F");

			pdf.setFillColor(216, 112, 140);
			pdf.roundedRect(22, 22, 166, 68, 5, 5, "F");
			pdf.setTextColor(255, 237, 240);
			pdf.setFont("helvetica", "bold");
			pdf.setFontSize(9);
			pdf.text("UM CONVITE DOCINHO", 33, 39);
			pdf.setTextColor(255, 255, 255);
			pdf.setFont("helvetica", "bold");
			pdf.setFontSize(21);
			pdf.text("Um sorvetinho?", 33, 57);
			pdf.setFont("helvetica", "normal");
			pdf.setFontSize(10);
			pdf.text("Uma ideia gostosa pra gente combinar.", 33, 74);

			pdf.setFillColor(242, 198, 145);
			pdf.setDrawColor(242, 198, 145);
			pdf.triangle(157, 53, 181, 53, 169, 82, "F");
			pdf.setFillColor(255, 222, 225);
			pdf.setDrawColor(255, 222, 225);
			pdf.circle(164, 51, 10, "F");
			pdf.setFillColor(190, 225, 239);
			pdf.setDrawColor(190, 225, 239);
			pdf.circle(175, 50, 8, "F");
			pdf.setFillColor(255, 247, 231);
			pdf.setDrawColor(255, 247, 231);
			pdf.circle(169, 43, 3, "F");

			pdf.setFillColor(255, 243, 241);
			pdf.roundedRect(22, 105, 166, 57, 4, 4, "F");
			pdf.setTextColor(181, 83, 112);
			pdf.setFont("helvetica", "bold");
			pdf.setFontSize(9);
			pdf.text("DIA ESCOLHIDO", 34, 122);
			pdf.setTextColor(72, 71, 76);
			pdf.setFont("helvetica", "normal");
			pdf.setFontSize(14);
			pdf.text(pdf.splitTextToSize(chosenDate, 140), 34, 143);

			pdf.setFillColor(235, 247, 250);
			pdf.roundedRect(22, 172, 166, 57, 4, 4, "F");
			pdf.setTextColor(78, 132, 151);
			pdf.setFont("helvetica", "bold");
			pdf.setFontSize(9);
			pdf.text("HORARIO", 34, 189);
			pdf.setTextColor(72, 71, 76);
			pdf.setFont("helvetica", "normal");
			pdf.setFontSize(13);
			pdf.text(pdf.splitTextToSize(chosenTime, 140), 34, 210);

			pdf.setDrawColor(240, 220, 216);
			pdf.setLineWidth(0.5);
			pdf.line(54, 248, 156, 248);
			pdf.setTextColor(190, 91, 118);
			pdf.setFont("helvetica", "bold");
			pdf.setFontSize(12);
			pdf.text("Com carinho, Sophia", 105, 263, { align: "center" });
			pdf.setTextColor(130, 185, 205);
			pdf.setFontSize(10);
			pdf.text("Vai ser uma tarde bem docinha.", 105, 272, { align: "center" });

			const pdfBlob = pdf.output("blob");
			const pdfFile = new File([pdfBlob], "sorvete.pdf", { type: "application/pdf" });

			if (navigator.canShare?.({ files: [pdfFile] }) && navigator.share) {
				await navigator.share({ title: "Nosso sorvetinho", text: message, files: [pdfFile] });
			} else {
				pdf.save("sorvete.pdf");
				window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener");
				document.querySelector("#share-status").textContent = "O PDF foi baixado. No WhatsApp, escolha a conversa e anexe o arquivo sorvete.pdf.";
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
