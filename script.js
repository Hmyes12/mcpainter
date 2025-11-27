document.addEventListener("DOMContentLoaded", async () => {
    // --- 1. SMART FETCH FOR URL.JSON ---
    try {
        // Try fetching relative to current location
        let response = await fetch('url.json');
        
        // If that fails (because we are in a subfolder), try one level up
        if (!response.ok) {
            response = await fetch('../url.json');
        }

        if (response.ok) {
            const config = await response.json();
            const baseUrl = config.websiteUrl.replace(/\/$/, ""); 
            const currentPath = window.location.pathname.replace(/\/index\.html$/, "/"); 

            // Update Canonical
            let canonical = document.querySelector('link[rel="canonical"]');
            if (canonical) {
                // If we are deep in a folder, simple append works better with full URL
                canonical.href = window.location.href.split('?')[0]; 
            }

            // Update OG URL
            let ogUrl = document.querySelector('meta[property="og:url"]');
            if (ogUrl) ogUrl.content = window.location.href.split('?')[0];

            // Update Schema
            const schemaScript = document.querySelector('script[type="application/ld+json"]');
            if (schemaScript) {
                const schema = JSON.parse(schemaScript.textContent);
                schema.url = baseUrl + "/";
                schema.logo = baseUrl + "/logo.png";
                schemaScript.textContent = JSON.stringify(schema, null, 2);
            }
        }
    } catch (e) { 
        console.warn("Could not load url.json"); 
    }

    // --- 2. MOBILE MENU ---
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-links");
    if(hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
        document.querySelectorAll(".nav-links a").forEach(n => n.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }));
    }

    // Dynamic Year
    const yearSpan = document.getElementById('year');
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();
});

// --- 3. GENERATOR LOGIC ---
const container = document.getElementById('gallery-container');

if (container) {
    const ASSET_BASE_URL = "https://raw.githubusercontent.com/PixiGeko/Minecraft-default-assets/latest/assets/minecraft/textures/painting/";
    
    // VISUAL SCALE: 1px Minecraft = 5px Screen (Keeps shape correct)
    const VISUAL_SCALE = 5; 

    const categories = [
        { label: "1x1 Small", w: 16, h: 16 }, { label: "1x2 Tall", w: 16, h: 32 }, { label: "2x1 Wide", w: 32, h: 16 }, { label: "2x2 Medium", w: 32, h: 32 }, { label: "4x2 Large Wide", w: 64, h: 32 }, { label: "4x3 Large", w: 64, h: 48 }, { label: "4x4 Massive", w: 64, h: 64 }, { label: "3x3 Square (1.21)", w: 48, h: 48 }, { label: "3x4 Tall (1.21)", w: 48, h: 64 }
    ];

    const paintings = [
        { id: "kebab", name: "Kebab", w: 16, h: 16, kx: 0, ky: 0 }, { id: "aztec", name: "Aztec", w: 16, h: 16, kx: 16, ky: 0 }, { id: "alban", name: "Alban", w: 16, h: 16, kx: 32, ky: 0 }, { id: "aztec2", name: "Aztec 2", w: 16, h: 16, kx: 48, ky: 0 }, { id: "bomb", name: "Bomb", w: 16, h: 16, kx: 64, ky: 0 }, { id: "plant", name: "Plant", w: 16, h: 16, kx: 80, ky: 0 }, { id: "wasteland", name: "Wasteland", w: 16, h: 16, kx: 96, ky: 0 },
        { id: "pool", name: "Pool", w: 32, h: 16, kx: 0, ky: 32 }, { id: "courbet", name: "Courbet", w: 32, h: 16, kx: 32, ky: 32 }, { id: "sea", name: "Sea", w: 32, h: 16, kx: 64, ky: 32 }, { id: "sunset", name: "Sunset", w: 32, h: 16, kx: 96, ky: 32 }, { id: "creebet", name: "Creebet", w: 32, h: 16, kx: 128, ky: 32 },
        { id: "wanderer", name: "Wanderer", w: 16, h: 32, kx: 0, ky: 64 }, { id: "graham", name: "Graham", w: 16, h: 32, kx: 16, ky: 64 }, { id: "prairie_ride", name: "Prairie Ride", w: 16, h: 32, kx: null, ky: null },
        { id: "fighters", name: "Fighters", w: 64, h: 32, kx: 0, ky: 96 }, { id: "passage", name: "Passage", w: 64, h: 32, kx: null, ky: null }, { id: "changing", name: "Changing", w: 64, h: 32, kx: null, ky: null }, { id: "finding", name: "Finding", w: 64, h: 32, kx: null, ky: null }, { id: "lowmist", name: "Low Mist", w: 64, h: 32, kx: null, ky: null },
        { id: "match", name: "Match", w: 32, h: 32, kx: 0, ky: 128 }, { id: "bust", name: "Bust", w: 32, h: 32, kx: 32, ky: 128 }, { id: "stage", name: "Stage", w: 32, h: 32, kx: 64, ky: 128 }, { id: "void", name: "Void", w: 32, h: 32, kx: 96, ky: 128 }, { id: "skull_and_roses", name: "Skull & Roses", w: 32, h: 32, kx: 128, ky: 128 }, { id: "wither", name: "Wither", w: 32, h: 32, kx: 160, ky: 128 }, { id: "baroque", name: "Baroque", w: 32, h: 32, kx: null, ky: null }, { id: "humble", name: "Humble", w: 32, h: 32, kx: null, ky: null },
        { id: "skeleton", name: "Skeleton", w: 64, h: 48, kx: 192, ky: 64 }, { id: "donkey_kong", name: "Donkey Kong", w: 64, h: 48, kx: 192, ky: 112 },
        { id: "pointer", name: "Pointer", w: 64, h: 64, kx: 0, ky: 192 }, { id: "pigscene", name: "Pigscene", w: 64, h: 64, kx: 64, ky: 192 }, { id: "burning_skull", name: "Burning Skull", w: 64, h: 64, kx: 128, ky: 192 }, { id: "unpacked", name: "Unpacked", w: 64, h: 64, kx: null, ky: null },
        { id: "bouqet", name: "Bouquet", w: 48, h: 48, kx: null, ky: null }, { id: "cavebird", name: "Cavebird", w: 48, h: 48, kx: null, ky: null }, { id: "cotan", name: "Cotan", w: 48, h: 48, kx: null, ky: null }, { id: "endboss", name: "Endboss", w: 48, h: 48, kx: null, ky: null }, { id: "fern", name: "Fern", w: 48, h: 48, kx: null, ky: null }, { id: "orb", name: "Orb", w: 48, h: 48, kx: null, ky: null }, { id: "owlemons", name: "Owlemons", w: 48, h: 48, kx: null, ky: null }, { id: "sunflowers", name: "Sunflowers", w: 48, h: 48, kx: null, ky: null }, { id: "tides", name: "Tides", w: 48, h: 48, kx: null, ky: null },
        { id: "backyard", name: "Backyard", w: 48, h: 64, kx: null, ky: null }, { id: "pond", name: "Pond", w: 48, h: 64, kx: null, ky: null }
    ];

    let userUploads = {};
    let currentSlot = null;
    let cropper = null;
    let selectedEdition = 'java';

    const fileInput = document.getElementById('file-upload');
    const modal = document.getElementById('modal');
    const cropModal = document.getElementById('crop-modal');
    const imageToCrop = document.getElementById('image-to-crop');
    const versionContainer = document.getElementById('version-select-container');
    const versionSelect = document.getElementById('version-select');

    function initGrid() {
        container.innerHTML = ""; 
        categories.forEach(cat => {
            const groupItems = paintings.filter(p => p.w === cat.w && p.h === cat.h);
            if (groupItems.length > 0) {
                const header = document.createElement('div');
                header.className = 'category-header';
                header.innerHTML = `<span class="category-title">${cat.label}</span> <span class="category-sub">${cat.w}x${cat.h}px</span>`;
                container.appendChild(header);

                const gridDiv = document.createElement('div');
                gridDiv.className = 'grid';

                groupItems.forEach(p => {
                    const div = document.createElement('div');
                    div.className = 'painting-slot';
                    div.id = `slot-${p.id}`;
                    
                    // SCALE DISPLAY SIZE
                    const dispW = p.w * VISUAL_SCALE;
                    const dispH = p.h * VISUAL_SCALE;

                    div.innerHTML = `
                        <img src="${ASSET_BASE_URL}${p.id}.png" id="img-${p.id}" crossorigin="anonymous" loading="lazy" style="width: ${dispW}px; height: ${dispH}px;">
                        <div class="slot-info">${p.name}<div class="edited-tag">HD READY</div></div>
                    `;
                    div.onclick = () => { currentSlot = p; fileInput.click(); };
                    gridDiv.appendChild(div);
                });
                container.appendChild(gridDiv);
            }
        });
    }

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && currentSlot) {
            const reader = new FileReader();
            reader.onload = (event) => {
                imageToCrop.src = event.target.result;
                cropModal.classList.remove('hidden');
                if (cropper) cropper.destroy();
                cropper = new Cropper(imageToCrop, { aspectRatio: currentSlot.w / currentSlot.h, viewMode: 1, autoCropArea: 1, dragMode: 'move', background: false });
            };
            reader.readAsDataURL(file);
        }
        fileInput.value = '';
    });

    document.getElementById('crop-confirm-btn').onclick = () => {
        if (cropper) {
            const HD_MULTIPLIER = 16; 
            const canvas = cropper.getCroppedCanvas({ width: currentSlot.w * HD_MULTIPLIER, height: currentSlot.h * HD_MULTIPLIER, fillColor: '#ffffff00', imageSmoothingEnabled: true, imageSmoothingQuality: 'high' });
            const croppedDataUrl = canvas.toDataURL('image/png');
            document.getElementById(`img-${currentSlot.id}`).src = croppedDataUrl;
            document.getElementById(`slot-${currentSlot.id}`).classList.add('edited');
            userUploads[currentSlot.id] = croppedDataUrl.split(',')[1];
            cropModal.classList.add('hidden');
            cropper.destroy();
            cropper = null;
        }
    };

    document.getElementById('crop-cancel-btn').onclick = () => { cropModal.classList.add('hidden'); if (cropper) { cropper.destroy(); cropper = null; } };

    async function generateKzPng() {
        const KZ_SCALE_FACTOR = 16; 
        const canvas = document.createElement('canvas');
        canvas.width = 256 * KZ_SCALE_FACTOR;
        canvas.height = 256 * KZ_SCALE_FACTOR;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
        const loadImage = (src) => new Promise((resolve, reject) => { const img = new Image(); img.crossOrigin = "anonymous"; img.onload = () => resolve(img); img.onerror = reject; img.src = src; });
        const legacyPaintings = paintings.filter(p => p.kx !== null);
        for (const p of legacyPaintings) {
            try {
                let src = userUploads[p.id] ? `data:image/png;base64,${userUploads[p.id]}` : `${ASSET_BASE_URL}${p.id}.png`;
                const img = await loadImage(src);
                ctx.drawImage(img, p.kx * KZ_SCALE_FACTOR, p.ky * KZ_SCALE_FACTOR, p.w * KZ_SCALE_FACTOR, p.h * KZ_SCALE_FACTOR);
            } catch (err) {}
        }
        return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    }

    document.getElementById('generate-btn').onclick = () => { modal.classList.remove('hidden'); versionContainer.classList.add('hidden'); };
    window.closeModal = function() { modal.classList.add('hidden'); }
    window.selectEdition = function(edition) {
        selectedEdition = edition;
        versionContainer.classList.remove('hidden');
        versionSelect.innerHTML = "";
        if (edition === 'java') {
            [{ val: 34, label: "1.21 (Latest)" }, { val: 22, label: "1.20.4" }, { val: 15, label: "1.20.1" }].forEach(v => { const opt = document.createElement('option'); opt.value = v.val; opt.innerText = v.label; versionSelect.appendChild(opt); });
        } else {
            const opt = document.createElement('option'); opt.value = "1.21.0"; opt.innerText = "1.21+ (Bedrock)"; versionSelect.appendChild(opt);
        }
    };

    document.getElementById('final-download-btn').onclick = async () => {
        const btn = document.getElementById('final-download-btn');
        const originalText = btn.innerText;
        btn.innerText = "Generating Pack..."; btn.disabled = true; btn.style.opacity = "0.7";

        try {
            const zip = new JSZip();
            const version = versionSelect.value;
            let packName = document.getElementById('pack-name').value.trim() || "Custom Paintings";
            const safeFilename = packName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

            try {
                const logoReq = await fetch('logo.png');
                if (logoReq.ok) {
                    const logoBlob = await logoReq.blob();
                    if (selectedEdition === 'java') zip.file("pack.png", logoBlob); else zip.file("pack_icon.png", logoBlob);
                }
            } catch (e) {}

            const texturesFolder = selectedEdition === 'java' ? zip.folder("assets/minecraft/textures/painting") : zip.folder("textures/painting");
            paintings.forEach(p => { if (userUploads[p.id]) texturesFolder.file(`${p.id}.png`, userUploads[p.id], {base64: true}); });

            if (selectedEdition === 'java') {
                const packMeta = { pack: { pack_format: parseInt(version), description: `${packName}\nAuthor: Frostyy4004` } };
                zip.file("pack.mcmeta", JSON.stringify(packMeta, null, 2));
                saveAs(await zip.generateAsync({type:"blob"}), `${safeFilename}-java.zip`);
            } else {
                const u1 = crypto.randomUUID(); const u2 = crypto.randomUUID();
                const manifest = { format_version: 2, header: { name: packName, description: "Created by Frostyy4004", uuid: u1, version: [1, 0, 0], min_engine_version: [1, 20, 0] }, modules: [{ type: "resources", uuid: u2, version: [1, 0, 0] }], metadata: { authors: ["Frostyy4004"] } };
                zip.file("manifest.json", JSON.stringify(manifest, null, 2));
                texturesFolder.file("kz.png", await generateKzPng());
                saveAs(await zip.generateAsync({type:"blob"}), `${safeFilename}.mcpack`);
            }
            closeModal();
        } catch (error) { alert("An error occurred."); } finally { btn.innerText = originalText; btn.disabled = false; btn.style.opacity = "1"; }
    };

    document.getElementById('download-templates-btn').onclick = async () => {
        const btn = document.getElementById('download-templates-btn');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = "Downloading..."; btn.disabled = true;
        const zip = new JSZip();
        const folder = zip.folder("minecraft_templates");
        const promises = paintings.map(async p => { try { const r = await fetch(`${ASSET_BASE_URL}${p.id}.png`); if(r.ok) folder.file(`${p.id}.png`, await r.blob()); } catch (e) {} });
        await Promise.all(promises);
        saveAs(await zip.generateAsync({type:"blob"}), "minecraft_painting_templates.zip");
        btn.innerHTML = originalHtml; btn.disabled = false;
    };

    initGrid();
}
