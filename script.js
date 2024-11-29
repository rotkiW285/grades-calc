document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('gradesForm');
    const addGradeButton = document.getElementById('addGrade');
    const clearGradesButton = document.getElementById('clearGrades');
    const saveProfileButton = document.getElementById('saveProfile');
    const deleteProfileButton = document.getElementById('deleteProfile');
    const profilesMenu = document.getElementById('profilesMenu');
    const averageDisplay = document.createElement('div');
    averageDisplay.id = 'averageDisplay';
    form.appendChild(averageDisplay);

    addGradeButton.addEventListener('click', () => {
        addGradeEntry();
        saveGradesToCache();
        calculateAndDisplayAverage();
    });

    clearGradesButton.addEventListener('click', () => {
        const gradeEntries = document.querySelectorAll('.grade-entry');
        gradeEntries.forEach(entry => entry.remove());
        localStorage.removeItem('grades');
        ensureAtLeastOneGradeEntry();
        calculateAndDisplayAverage();
    });

    saveProfileButton.addEventListener('click', () => {
        const profileName = prompt('Podaj nazwę profilu:');
        if (profileName) {
            saveProfile(profileName);
            loadProfilesMenu();
        }
    });

    deleteProfileButton.addEventListener('click', () => {
        const selectedProfile = profilesMenu.value;
        if (selectedProfile) {
            deleteProfile(selectedProfile);
            loadProfilesMenu();
        }
    });

    profilesMenu.addEventListener('change', () => {
        const selectedProfile = profilesMenu.value;
        if (selectedProfile) {
            loadProfile(selectedProfile);
        }
    });

    form.addEventListener('input', () => {
        saveGradesToCache();
        calculateAndDisplayAverage();
    });

    function addGradeEntry(grade = '', weight = '') {
        const gradeEntry = document.createElement('div');
        gradeEntry.className = 'grade-entry';
        gradeEntry.innerHTML = `
            <input type="number" name="grade" placeholder="Ocena" value="${grade}" required inputmode="numeric">
            <input type="number" name="weight" placeholder="Waga" value="${weight}" required inputmode="numeric">
            <button type="button" class="removeGrade">Usuń</button>
        `;
        form.insertBefore(gradeEntry, addGradeButton);

        gradeEntry.querySelector('.removeGrade').addEventListener('click', () => {
            gradeEntry.remove();
            saveGradesToCache();
            ensureAtLeastOneGradeEntry();
            calculateAndDisplayAverage();
        });
    }

    function saveGradesToCache() {
        const grades = [];
        document.querySelectorAll('.grade-entry').forEach(entry => {
            const grade = entry.querySelector('input[name="grade"]').value;
            const weight = entry.querySelector('input[name="weight"]').value;
            if (grade && weight) {
                grades.push({ grade: parseFloat(grade), weight: parseFloat(weight) });
            }
        });
        localStorage.setItem('grades', JSON.stringify(grades));
    }

    function loadGradesFromCache() {
        const grades = JSON.parse(localStorage.getItem('grades')) || [];
        grades.forEach(({ grade, weight }) => {
            addGradeEntry(grade, weight);
        });
        ensureAtLeastOneGradeEntry();
        calculateAndDisplayAverage();
    }

    function calculateAndDisplayAverage() {
        const grades = JSON.parse(localStorage.getItem('grades')) || [];
        if (grades.length === 0) {
            averageDisplay.textContent = '';
            return;
        }
        let totalWeight = 0;
        let weightedSum = 0;
        grades.forEach(({ grade, weight }) => {
            weightedSum += grade * weight;
            totalWeight += weight;
        });
        const weightedAverage = weightedSum / totalWeight;
        averageDisplay.textContent = `Średnia ważona: ${weightedAverage.toFixed(2)}`;
    }

    function saveProfile(profileName) {
        const grades = JSON.parse(localStorage.getItem('grades')) || [];
        const profiles = JSON.parse(localStorage.getItem('profiles')) || {};
        profiles[profileName] = grades;
        localStorage.setItem('profiles', JSON.stringify(profiles));
    }

    function loadProfile(profileName) {
        const profiles = JSON.parse(localStorage.getItem('profiles')) || {};
        const grades = profiles[profileName] || [];
        document.querySelectorAll('.grade-entry').forEach(entry => entry.remove());
        grades.forEach(({ grade, weight }) => {
            addGradeEntry(grade, weight);
        });
        saveGradesToCache();
        calculateAndDisplayAverage();
    }

    function deleteProfile(profileName) {
        const profiles = JSON.parse(localStorage.getItem('profiles')) || {};
        delete profiles[profileName];
        localStorage.setItem('profiles', JSON.stringify(profiles));
    }

    function loadProfilesMenu() {
        const profiles = JSON.parse(localStorage.getItem('profiles')) || {};
        profilesMenu.innerHTML = '<option value="">Wybierz profil</option>';
        Object.keys(profiles).forEach(profileName => {
            const option = document.createElement('option');
            option.value = profileName;
            option.textContent = profileName;
            profilesMenu.appendChild(option);
        });
    }

    function ensureAtLeastOneGradeEntry() {
        if (document.querySelectorAll('.grade-entry').length === 0) {
            addGradeEntry();
        }
    }

    loadGradesFromCache();
    loadProfilesMenu();
});