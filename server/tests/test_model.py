import tempfile
import unittest
import zipfile
from pathlib import Path

from app.model import _read_dataset, _symptom_id


class DatasetTests(unittest.TestCase):
    def test_symptom_ids_are_stable_slugs(self):
        self.assertEqual(_symptom_id("Shortness of breath"), "shortness_of_breath")
        self.assertEqual(_symptom_id("itching of skin"), "itching_of_skin")

    def test_reads_csv_from_supplied_zip_format(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            path = Path(temp_dir) / "dataset.zip"
            with zipfile.ZipFile(path, "w") as archive:
                archive.writestr(
                    "symptoms.csv",
                    "diseases,fever,shortness of breath\n"
                    "condition a,1,0\n"
                    "condition b,0,1\n",
                )

            features, labels, feature_names = _read_dataset(path)

        self.assertEqual(feature_names, ["fever", "shortness of breath"])
        self.assertEqual(features.toarray().tolist(), [[1.0, 0.0], [0.0, 1.0]])
        self.assertEqual(labels.tolist(), ["condition a", "condition b"])


if __name__ == "__main__":
    unittest.main()
